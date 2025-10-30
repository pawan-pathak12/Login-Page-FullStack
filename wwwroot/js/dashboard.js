// Dashboard functionality
class VehicleManagementSystem {
    constructor() {
        this.currentSection = 'overview';
        this.init();
    }

    init() {
        this.loadUserInfo();
        this.setupNavigation();
        this.loadCurrentDate();
        this.loadDashboardData();
        this.setupEventListeners();
    }

    loadUserInfo() {
        const userName = localStorage.getItem('userName') || 'User';
        const userRole = localStorage.getItem('userRole') || 'User';

        document.getElementById('userName').textContent = userName;
        document.getElementById('userRole').textContent = userRole;
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();

                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));

                // Add active class to clicked item
                item.classList.add('active');

                // Show corresponding section
                const section = item.getAttribute('data-section');
                this.showSection(section);
            });
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionName).classList.add('active');

        // Update section title
        const titles = {
            'overview': 'Dashboard Overview',
            'vehicles': 'Vehicle Fleet Management',
            'maintenance': 'Maintenance Schedule',
            'reports': 'Reports & Analytics',
            'drivers': 'Driver Management'
        };

        document.getElementById('sectionTitle').textContent = titles[sectionName] || 'Dashboard';
        this.currentSection = sectionName;

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'vehicles':
                this.loadVehicles();
                break;
            case 'maintenance':
                this.loadMaintenance();
                break;
            case 'drivers':
                this.loadDrivers();
                break;
        }
    }

    loadDashboardData() {
        // Simulate loading data - replace with actual API calls
        setTimeout(() => {
            document.getElementById('totalVehicles').textContent = '15';
            document.getElementById('availableVehicles').textContent = '9';
            document.getElementById('maintenanceVehicles').textContent = '3';
        }, 500);
    }

    loadVehicles() {
        const vehiclesGrid = document.getElementById('vehiclesGrid');

        // Sample vehicle data - replace with API call
        const vehicles = [
            { id: 1, name: 'Toyota Camry', plate: 'ABC-123', status: 'available', fuel: '85%', mileage: '45,230' },
            { id: 2, name: 'Ford Transit', plate: 'DEF-456', status: 'inuse', fuel: '45%', mileage: '89,120' },
            { id: 3, name: 'Honda Civic', plate: 'GHI-789', status: 'maintenance', fuel: '90%', mileage: '32,450' }
        ];

        vehiclesGrid.innerHTML = vehicles.map(vehicle => `
            <div class="vehicle-card">
                <div class="vehicle-header">
                    <div class="vehicle-info">
                        <h3>${vehicle.name}</h3>
                        <p>Plate: ${vehicle.plate}</p>
                    </div>
                    <span class="vehicle-status status-${vehicle.status}">
                        ${vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </span>
                </div>
                <div class="vehicle-details">
                    <div class="detail-item">
                        <span>Fuel Level:</span>
                        <span>${vehicle.fuel}</span>
                    </div>
                    <div class="detail-item">
                        <span>Mileage:</span>
                        <span>${vehicle.mileage} km</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadMaintenance() {
        const maintenanceList = document.getElementById('maintenanceList');

        // Sample maintenance data
        const maintenance = [
            { vehicle: 'Toyota Camry (ABC-123)', type: 'Oil Change', dueDate: '2024-01-15' },
            { vehicle: 'Ford Transit (DEF-456)', type: 'Brake Inspection', dueDate: '2024-01-20' }
        ];

        maintenanceList.innerHTML = maintenance.map(item => `
            <div class="activity-item">
                <span class="activity-icon">🔧</span>
                <div class="activity-details">
                    <p>${item.type} for ${item.vehicle}</p>
                    <small>Due: ${item.dueDate}</small>
                </div>
            </div>
        `).join('');
    }

    loadDrivers() {
        const driversList = document.getElementById('driversList');

        // Sample drivers data
        const drivers = [
            { name: 'John Smith', license: 'DL-12345', assignedVehicle: 'Toyota Camry' },
            { name: 'Maria Garcia', license: 'DL-67890', assignedVehicle: 'Ford Transit' }
        ];

        driversList.innerHTML = drivers.map(driver => `
            <div class="vehicle-card">
                <h3>${driver.name}</h3>
                <div class="vehicle-details">
                    <div class="detail-item">
                        <span>License:</span>
                        <span>${driver.license}</span>
                    </div>
                    <div class="detail-item">
                        <span>Assigned Vehicle:</span>
                        <span>${driver.assignedVehicle}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadCurrentDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
    }

    setupEventListeners() {
        // Add any additional event listeners here
    }
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}

function showAddVehicleModal() {
    alert('Add Vehicle functionality will be implemented with backend integration');
    // This will open a modal for adding new vehicles
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VehicleManagementSystem();
});