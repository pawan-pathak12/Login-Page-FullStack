
using Microsoft.Extensions.Configuration;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using PersonalAssistantAI.Plugin;

namespace PersonalAssistantAI.Services;

public static class ChatService
{
    
    #region 1
    public static async Task StartChat(Kernel kernel)
    {
        #region Load configuration
        var config = new ConfigurationBuilder()
                        .SetBasePath(AppContext.BaseDirectory)
                        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                        .Build();

        var google = config.GetSection("GoogleSearch");
        var apiKey = google["ApiKey"] ?? throw new InvalidOperationException("Google API key missing");
        var engineId = google["SearchEngineId"] ?? throw new InvalidOperationException("Search engine ID missing");
        #endregion

        var webSearch = new WebSearchService(apiKey, engineId);

        kernel.Plugins.AddFromObject(new WebSearchPlugin(apiKey, engineId));
        var ttsService = new TextToSpeechService();
        var (history, isNew) = FileService.LoadConversation();

        #region JARVIS Prompt
        if (isNew)
        {
            history.AddSystemMessage(@"You are JARVIS - Just A Rather Very Intelligent System.
                Act as an advanced AI assistant with sophisticated, professional personality.

                PERSONALITY:
                - Intelligent, analytical, and proactive
                - Confident and precise in communication  
                - Professional tone with subtle wit
                - Address the user respectfully but naturally

                RESPONSE STYLE:
                - Concise but thorough in explanations
                - Natural, flowing language - not robotic
                - Add brief analytical insights when appropriate
                - Break down complex topics clearly

                CRITICAL FUNCTIONAL RULES:
                - For weather queries, ALWAYS call the actual WeatherRealTimePlugin
                - For time queries, always call the actual TimePlugin  
                - NEVER use cached responses from conversation history
                - ALWAYS fetch fresh data from the API
                - For unknown/time-sensitive info, use web search via [[SEARCH: your query here]]

                Maintain this personality while following all functional rules above.");
            Console.WriteLine("Started new Conversation");
        }
        #endregion

        else
        {
            Console.WriteLine($"Loaded last Conversation with {history.Count} messages");
        }

        var execSettings = new OpenAIPromptExecutionSettings
        {
            FunctionChoiceBehavior = FunctionChoiceBehavior.Auto()
        };

        #region Whisper Voice Service
        WhisperVoiceService? whisper = null;

        whisper = new WhisperVoiceService(async text =>
        {
            if (whisper != null)
            {
                await ProcessMessageAsync(text, history, kernel, execSettings, webSearch, whisper, ttsService);
                // Always restart after processing
                // Wait for TTS to finish before restarting voice
                await WaitForTTSFinish(ttsService, whisper);
            }
        }, ttsService);

        Console.WriteLine("🎤 Voice activated (speak now - 5 second recording)");
        Console.WriteLine("Type 'q' to quit, 'voice' to toggle voice responses");
        whisper.StartOneShot();
        #endregion

        await ChatLoop(history, kernel, execSettings, webSearch, whisper, ttsService);
        FileService.SaveConversation(history);
    }
#endregion

#region  2 
    private static async Task ChatLoop(ChatHistory history, Kernel kernel,
        OpenAIPromptExecutionSettings exec, WebSearchService webSearch, WhisperVoiceService whisper,
        TextToSpeechService ttsService)
    {
        int empty = 0;

        while (true)
        {
            try
            {
                // Don't show prompt if TTS is speaking
                if (!ttsService.IsSpeaking)
                {
                    Console.WriteLine();
                    Console.Write("User > ");
                    var input = Console.ReadLine()!.Trim();

                    if (string.IsNullOrWhiteSpace(input))
                    {
                        if (++empty >= 3) break;
                        Console.WriteLine("Type or wait for voice...");
                        continue;
                    }

                    empty = 0;

                    if (input.Equals("q", StringComparison.OrdinalIgnoreCase) ||
                        input.Equals("quit", StringComparison.OrdinalIgnoreCase))
                        break;

                    // Add voice toggle command
                    if (input.Equals("voice", StringComparison.OrdinalIgnoreCase))
                    {
                        ttsService.Toggle();
                        continue;
                    }

                    await ProcessMessageAsync(input, history, kernel, exec, webSearch, whisper, ttsService);
                    // Wait for TTS to finish before restarting voice
                    await WaitForTTSFinish(ttsService, whisper);


                }
                else
                {
                    // Wait while TTS is speaking
                    await Task.Delay(100);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in chat loop: {ex.Message}");
            }
        }
    }

#region 

#region    3
    private static async Task ProcessMessageAsync(string userMessage, ChatHistory history,
        Kernel kernel, OpenAIPromptExecutionSettings execSettings,
        WebSearchService webSearch, WhisperVoiceService whisper, TextToSpeechService ttsService)
    {
        #region PDF Processing
        if (userMessage.StartsWith("/pdf ", StringComparison.OrdinalIgnoreCase))
        {
            var path = userMessage.Substring(5).Trim();
            var pdf = PdfService.LoadOrCreatePdf(path);
            if (string.IsNullOrWhiteSpace(pdf))
            {
                Console.WriteLine("PDF could not be loaded.");
                return;
            }
            history.AddUserMessage($"[PDF] {Path.GetFileName(path)}\n{pdf}");
            Console.WriteLine("PDF loaded into context.");

            // Restart voice after PDF processing
            whisper.StartOneShot();
            return;
        }
        #endregion



        // Normal AI chat
        history.AddUserMessage(userMessage);

        var chat = kernel.GetRequiredService<IChatCompletionService>();
        var answer = await chat.GetChatMessageContentAsync(history, execSettings, kernel);

        Console.ForegroundColor = ConsoleColor.Blue;
        Console.Write("\nPersonal Assistant > ");
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine(answer);
        Console.ResetColor();

        history.AddAssistantMessage(answer.Content ?? string.Empty);

        // SPEAK THE RESPONSE (filter out listening prompts)
        var responseText = answer.Content ?? string.Empty;
        if (!responseText.Contains("Listening...") &&
            !responseText.StartsWith("How can I assist you"))
        {
            ttsService.Speak(responseText);
        }

        _ = Task.Run(() => ManageConversation(history));

        // Wait a moment for TTS to start, then check if we should restart voice
        await Task.Delay(500);
        if (!ttsService.IsSpeaking)
        {
            whisper.StartOneShot();
        }
    }
#endregion`
   
}