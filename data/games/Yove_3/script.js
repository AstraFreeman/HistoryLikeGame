// script.js - Main game logic for Meme Tower Defense

class TowerDefenseGame {
    constructor() {
        // Game state
        this.gameState = 'playing'; // 'playing', 'paused', 'question', 'gameOver'
        this.score = 0;
        this.enemiesKilled = 0;
        this.questionThreshold = 10; // Show question every 10 kills
        
        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.tower = null;
        this.enemies = [];
        this.projectiles = [];
        
        // Game settings
        this.towerStats = {
            power: 10,
            fireRate: 1.0, // seconds between shots
            lastShot: 0,
            range: 15
        };
        
        // Camera settings
        this.cameraPosition = { x: 0, y: 10, z: 20 };
        this.cameraSpeed = 0.5;
        
        // Input handling
        this.keys = {};
        
        // Enemy spawning
        this.enemySpawnRate = 2000; // milliseconds
        this.lastEnemySpawn = 0;
        this.enemySpeed = 0.02;
        
        // Question system
        this.questionManager = new QuestionManager();
        this.currentQuestion = null;
        
        // Animation
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.createTower();
        this.setupEventListeners();
        this.setupUI();
        this.gameLoop();
        
        console.log('Мем Tower Defense гра ініціалізована!');
    }
    
    setupScene() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        const canvas = document.getElementById('gameCanvas');
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Create ground plane
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Create enemy path indicators
        this.createPath();
    }
    
    createPath() {
        // Create a simple path from right to left
        const pathGeometry = new THREE.BoxGeometry(50, 0.1, 2);
        const pathMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const path = new THREE.Mesh(pathGeometry, pathMaterial);
        path.position.y = 0.05;
        this.scene.add(path);
        
        // Add path markers
        for (let i = -20; i <= 20; i += 5) {
            const markerGeometry = new THREE.ConeGeometry(0.5, 1, 4);
            const markerMaterial = new THREE.MeshLambertMaterial({ color: 0xFF6347 });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set(i, 0.5, 2);
            this.scene.add(marker);
        }
    }
    
    createTower() {
        // Try to load GLTF model, fallback to cone
        this.loadTowerModel().catch(() => {
            console.log('Модель вежі не знайдена, використовується конус');
            this.createConeTower();
        });
    }
    
    async loadTowerModel() {
        // This would load a GLTF model if available
        // For now, we'll use the fallback cone
        throw new Error('Завантаження моделі не реалізовано');
    }
    
    createConeTower() {
        const towerGeometry = new THREE.ConeGeometry(2, 4, 8);
        const towerMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 });
        this.tower = new THREE.Mesh(towerGeometry, towerMaterial);
        this.tower.position.set(0, 2, -5);
        this.tower.castShadow = true;
        this.scene.add(this.tower);
        
        // Add tower base
        const baseGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.5, 8);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(0, 0.25, -5);
        this.scene.add(base);
    }
    
    spawnEnemy() {
        const now = Date.now();
        if (now - this.lastEnemySpawn > this.enemySpawnRate) {
            this.createEnemy();
            this.lastEnemySpawn = now;
        }
    }
    
    createEnemy() {
        // Try to load GLTF model, fallback to cube
        this.loadEnemyModel().catch(() => {
            this.createCubeEnemy();
        });
    }
    
    async loadEnemyModel() {
        // This would load a GLTF model if available
        throw new Error('Завантаження моделі ворога не реалізовано');
    }
    
    createCubeEnemy() {
        const enemyGeometry = new THREE.BoxGeometry(1, 1, 1);
        const enemyMaterial = new THREE.MeshLambertMaterial({ 
            color: Math.random() * 0xffffff 
        });
        const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
        
        // Spawn at right side
        enemy.position.set(25, 0.5, 0);
        enemy.userData = {
            health: this.towerStats.power,
            maxHealth: this.towerStats.power,
            speed: this.enemySpeed + Math.random() * 0.02,
            direction: new THREE.Vector3(-1, 0, 0)
        };
        
        enemy.castShadow = true;
        this.scene.add(enemy);
        this.enemies.push(enemy);
    }
    
    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Move enemy
            enemy.position.add(
                enemy.userData.direction.clone().multiplyScalar(enemy.userData.speed)
            );
            
            // Remove if off screen (left side)
            if (enemy.position.x < -25) {
                this.scene.remove(enemy);
                this.enemies.splice(i, 1);
            }
            
            // Rotate enemy for visual effect
            enemy.rotation.y += 0.05;
        }
    }
    
    towerShoot() {
        const now = Date.now();
        if (now - this.towerStats.lastShot < this.towerStats.fireRate * 1000) {
            return;
        }
        
        // Find nearest enemy in range
        let nearestEnemy = null;
        let nearestDistance = this.towerStats.range;
        
        this.enemies.forEach(enemy => {
            const distance = this.tower.position.distanceTo(enemy.position);
            if (distance < nearestDistance) {
                nearestEnemy = enemy;
                nearestDistance = distance;
            }
        });
        
        if (nearestEnemy) {
            this.createProjectile(nearestEnemy);
            this.towerStats.lastShot = now;
        }
    }
    
    createProjectile(target) {
        const projectileGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const projectileMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFF00 });
        const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);
        
        projectile.position.copy(this.tower.position);
        projectile.userData = {
            target: target,
            speed: 0.5,
            damage: this.towerStats.power
        };
        
        this.scene.add(projectile);
        this.projectiles.push(projectile);
    }
    
    updateProjectiles() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            const target = projectile.userData.target;
            
            if (!target || !this.enemies.includes(target)) {
                // Target destroyed or missing
                this.scene.remove(projectile);
                this.projectiles.splice(i, 1);
                continue;
            }
            
            // Move towards target
            const direction = target.position.clone().sub(projectile.position).normalize();
            projectile.position.add(direction.multiplyScalar(projectile.userData.speed));
            
            // Check collision
            const distance = projectile.position.distanceTo(target.position);
            if (distance < 0.5) {
                this.hitEnemy(target, projectile.userData.damage);
                this.scene.remove(projectile);
                this.projectiles.splice(i, 1);
            }
        }
    }
    
    hitEnemy(enemy, damage) {
        enemy.userData.health -= damage;
        
        // Visual damage effect
        enemy.material.color.setHex(0xFF0000);
        setTimeout(() => {
            if (enemy.material) {
                enemy.material.color.setHex(Math.random() * 0xffffff);
            }
        }, 100);
        
        if (enemy.userData.health <= 0) {
            this.destroyEnemy(enemy);
        }
    }
    
    destroyEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
            this.scene.remove(enemy);
            
            this.enemiesKilled++;
            this.score += 10;
            this.updateUI();
            
            // Check for question trigger
            if (this.enemiesKilled % this.questionThreshold === 0) {
                this.triggerQuestion();
            }
        }
    }
    
    triggerQuestion() {
        this.gameState = 'question';
        this.currentQuestion = this.questionManager.getNextQuestion();
        this.showQuestionPanel();
    }
    
    showQuestionPanel() {
        const panel = document.getElementById('questionPanel');
        const img = document.getElementById('questionImg');
        const text = document.getElementById('questionText');
        const answerBtns = document.querySelectorAll('.answer-btn');
        
        // Set question content
        img.src = this.currentQuestion.imagePath;
        img.onerror = () => {
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7QnNC10Lwg0JfQvtCx0YDQsNC20LXQvdC90Y88L3RleHQ+PC9zdmc+';
        };
        text.textContent = this.currentQuestion.questionText;
        
        // Set answer buttons
        answerBtns.forEach((btn, index) => {
            btn.textContent = this.currentQuestion.answers[index];
            btn.onclick = () => this.answerQuestion(index);
        });
        
        panel.classList.remove('hidden');
    }
    
    answerQuestion(selectedIndex) {
        const isCorrect = selectedIndex === this.currentQuestion.correctAnswer;
        const resultDiv = document.getElementById('questionResult');
        
        if (isCorrect) {
            this.upgradeTower();
            resultDiv.innerHTML = `<div class="correct">Правильно! ${this.currentQuestion.explanation}</div>`;
            resultDiv.style.color = '#4CAF50';
        } else {
            resultDiv.innerHTML = `<div class="incorrect">Неправильно! ${this.currentQuestion.explanation}</div>`;
            resultDiv.style.color = '#f44336';
        }
        
        resultDiv.classList.remove('hidden');
        
        // Hide panel after delay
        setTimeout(() => {
            this.hideQuestionPanel();
        }, 3000);
    }
    
    upgradeTower() {
        this.towerStats.power += 5;
        this.towerStats.fireRate = Math.max(0.3, this.towerStats.fireRate - 0.1);
        this.towerStats.range += 2;
        
        // Visual upgrade effect
        if (this.tower) {
            this.tower.material.color.setHex(Math.random() * 0xffffff);
            this.tower.scale.multiplyScalar(1.1);
        }
        
        this.updateUI();
        console.log('Вежа покращена!', this.towerStats);
    }
    
    hideQuestionPanel() {
        document.getElementById('questionPanel').classList.add('hidden');
        document.getElementById('questionResult').classList.add('hidden');
        this.gameState = 'playing';
    }
    
    handleInput() {
        if (this.gameState !== 'playing') return;
        
        // Camera movement with arrow keys
        if (this.keys['ArrowUp']) {
            this.cameraPosition.z -= this.cameraSpeed;
        }
        if (this.keys['ArrowDown']) {
            this.cameraPosition.z += this.cameraSpeed;
        }
        if (this.keys['ArrowLeft']) {
            this.cameraPosition.x -= this.cameraSpeed;
        }
        if (this.keys['ArrowRight']) {
            this.cameraPosition.x += this.cameraSpeed;
        }
        
        // Update camera position
        this.camera.position.set(
            this.cameraPosition.x,
            this.cameraPosition.y,
            this.cameraPosition.z
        );
        this.camera.lookAt(0, 0, 0);
    }
    
    setupEventListeners() {
        // Keyboard input
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Restart button
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    setupUI() {
        this.updateUI();
    }
    
    updateUI() {
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('killedValue').textContent = this.enemiesKilled;
        document.getElementById('towerPower').textContent = this.towerStats.power;
        document.getElementById('fireRate').textContent = this.towerStats.fireRate.toFixed(1);
    }
    
    gameLoop() {
        if (this.gameState === 'playing') {
            this.handleInput();
            this.spawnEnemy();
            this.updateEnemies();
            this.towerShoot();
            this.updateProjectiles();
        }
        
        this.renderer.render(this.scene, this.camera);
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    restartGame() {
        // Reset game state
        this.gameState = 'playing';
        this.score = 0;
        this.enemiesKilled = 0;
        
        // Reset tower stats
        this.towerStats = {
            power: 10,
            fireRate: 1.0,
            lastShot: 0,
            range: 15
        };
        
        // Clear entities
        this.enemies.forEach(enemy => this.scene.remove(enemy));
        this.projectiles.forEach(projectile => this.scene.remove(projectile));
        this.enemies = [];
        this.projectiles = [];
        
        // Reset question manager
        this.questionManager.reset();
        
        // Hide panels
        document.getElementById('gameOverPanel').classList.add('hidden');
        document.getElementById('questionPanel').classList.add('hidden');
        
        // Reset tower appearance
        if (this.tower) {
            this.tower.material.color.setHex(0x4169E1);
            this.tower.scale.set(1, 1, 1);
        }
        
        this.updateUI();
        console.log('Гра перезапущена!');
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverPanel').classList.remove('hidden');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new TowerDefenseGame();
    
            // Зробити гру доступною глобально для налагодження
    window.game = game;
});