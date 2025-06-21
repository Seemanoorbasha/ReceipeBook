// Common functionality
let recipes = JSON.parse(localStorage.getItem('gourmetRecipes')) || [];

function saveRecipes() {
    localStorage.setItem('gourmetRecipes', JSON.stringify(recipes));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Initialize recipes with sample data if empty
if (recipes.length === 0) {
    recipes = [
        {
            id: generateId(),
            name: "Truffle Mushroom Risotto",
            image: "https://images.unsplash.com/photo-1603105037880-880cd4dd2967",
            ingredients: ["1 cup Arborio rice", "4 cups vegetable broth", "1 cup mixed mushrooms", "2 tbsp truffle oil", "1/2 cup white wine", "1 onion, diced", "3 cloves garlic", "1/4 cup parmesan"],
            steps: ["Sauté onions and garlic", "Add rice and toast for 2 min", "Deglaze with white wine", "Add broth gradually", "Stir in mushrooms", "Finish with truffle oil and parmesan"],
            time: "40 min",
            servings: 4,
            category: "Main Courses"
        },
        {
            id: generateId(),
            name: "Berry Pavlova",
            image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e",
            ingredients: ["4 egg whites", "1 cup caster sugar", "1 tsp white vinegar", "1 tsp cornstarch", "1 cup heavy cream", "2 cups mixed berries", "Mint leaves for garnish"],
            steps: ["Preheat oven to 120°C", "Beat egg whites to stiff peaks", "Gradually add sugar", "Fold in vinegar and cornstarch", "Shape into circle on baking sheet", "Bake for 90 min then cool", "Top with whipped cream and berries"],
            time: "2 hours",
            servings: 6,
            category: "Desserts"
        },
        {
            id: generateId(),
            name: "Mediterranean Veggie Bowl",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
            ingredients: ["1 cup quinoa", "2 cups water", "1 cucumber, diced", "1 cup cherry tomatoes", "1/2 cup feta cheese", "1/4 cup kalamata olives", "2 tbsp olive oil", "1 tbsp lemon juice"],
            steps: ["Cook quinoa in water for 15 min", "Chop vegetables and combine", "Add feta and olives", "Whisk olive oil and lemon juice", "Toss everything together"],
            time: "25 min",
            servings: 2,
            category: "Vegetarian"
        },
        
    ];
    saveRecipes();
}

// Toast notification
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = "toast show";
    
    // Set background color based on type
    if (type === "success") {
        toast.style.backgroundColor = "#4CAF50";
    } else if (type === "error") {
        toast.style.backgroundColor = "#F44336";
    }
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.className = "toast";
    }, 3000);
}

// User Page Functionality
if (document.querySelector('#recipe-container')) {
    const recipeContainer = document.getElementById('recipe-container');
    const modal = document.getElementById('recipe-modal');
    const closeBtn = document.querySelector('.close');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const categories = document.querySelectorAll('.category');
    let activeCategory = 'all';

    function renderRecipes() {
        recipeContainer.innerHTML = '';
        
        // Filter by category
        let filteredRecipes = recipes;
        if (activeCategory !== 'all') {
            filteredRecipes = recipes.filter(recipe => recipe.category === activeCategory);
        }
        
        filteredRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                <div class="recipe-category">${recipe.category}</div>
                <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
                <div class="recipe-info">
                    <h3>${recipe.name}</h3>
                    <div class="recipe-details">
                        <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                        <span><i class="fas fa-users"></i> ${recipe.servings} servings</span>
                    </div>
                </div>
            `;
            recipeCard.addEventListener('click', () => openModal(recipe));
            recipeContainer.appendChild(recipeCard);
        });
    }

    function openModal(recipe) {
        document.getElementById('modal-title').textContent = recipe.name;
        document.getElementById('modal-image').src = recipe.image;
        document.getElementById('modal-time').textContent = recipe.time;
        document.getElementById('modal-servings').textContent = recipe.servings;
        document.getElementById('modal-category').textContent = recipe.category;
        
        const ingredientsList = document.getElementById('modal-ingredients');
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
        
        const stepsList = document.getElementById('modal-steps');
        stepsList.innerHTML = '';
        recipe.steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            stepsList.appendChild(li);
        });
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Search functionality
    function searchRecipes() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm === '') {
            renderRecipes();
            return;
        }
        
        const filteredRecipes = recipes.filter(recipe => {
            return (
                recipe.name.toLowerCase().includes(searchTerm) ||
                recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm)) ||
                recipe.category.toLowerCase().includes(searchTerm) ||
                recipe.steps.some(step => step.toLowerCase().includes(searchTerm))
            );
        });
        
        recipeContainer.innerHTML = '';
        filteredRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                <div class="recipe-category">${recipe.category}</div>
                <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
                <div class="recipe-info">
                    <h3>${recipe.name}</h3>
                    <div class="recipe-details">
                        <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                        <span><i class="fas fa-users"></i> ${recipe.servings} servings</span>
                    </div>
                </div>
            `;
            recipeCard.addEventListener('click', () => openModal(recipe));
            recipeContainer.appendChild(recipeCard);
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', searchRecipes);
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchRecipes();
            }
        });
    }

    // Category filtering
    categories.forEach(category => {
        category.addEventListener('click', () => {
            document.querySelector('.category.active').classList.remove('active');
            category.classList.add('active');
            
            activeCategory = category.dataset.category;
            renderRecipes();
        });
    });

    renderRecipes();
}

// Admin Page Functionality
if (document.getElementById('recipe-form')) {
    const recipeForm = document.getElementById('recipe-form');
    const adminRecipeContainer = document.getElementById('admin-recipe-container');
    const adminSearch = document.getElementById('admin-search');
    const adminSearchBtn = document.getElementById('admin-search-btn');
    let editId = null;

    function renderAdminRecipes(filteredRecipes = recipes) {
        adminRecipeContainer.innerHTML = '';
        filteredRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                <div class="recipe-category">${recipe.category}</div>
                <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
                <div class="recipe-info">
                    <h3>${recipe.name}</h3>
                    <div class="recipe-details">
                        <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                        <span><i class="fas fa-users"></i> ${recipe.servings} servings</span>
                    </div>
                    <div class="recipe-actions">
                        <div class="edit-btn" data-id="${recipe.id}"><i class="fas fa-edit"></i> Edit</div>
                        <div class="delete-btn" data-id="${recipe.id}"><i class="fas fa-trash-alt"></i> Delete</div>
                    </div>
                </div>
            `;
            adminRecipeContainer.appendChild(recipeCard);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.edit-btn').dataset.id;
                editRecipe(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.delete-btn').dataset.id;
                deleteRecipe(id);
            });
        });
    }

    function editRecipe(id) {
        const recipe = recipes.find(r => r.id === id);
        if (!recipe) return;
        
        document.getElementById('name').value = recipe.name;
        document.getElementById('image').value = recipe.image;
        document.getElementById('category').value = recipe.category;
        document.getElementById('ingredients').value = recipe.ingredients.join('\n');
        document.getElementById('steps').value = recipe.steps.join('\n');
        document.getElementById('time').value = recipe.time;
        document.getElementById('servings').value = recipe.servings;
        
        editId = id;
        
        // Scroll to form
        document.querySelector('.admin-panel').scrollIntoView({
            behavior: 'smooth'
        });
        
        showToast(`Editing recipe: ${recipe.name}`, "success");
    }

    function deleteRecipe(id) {
        const recipe = recipes.find(r => r.id === id);
        if (!recipe) return;
        
        if (confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
            recipes = recipes.filter(recipe => recipe.id !== id);
            saveRecipes();
            renderAdminRecipes();
            showToast(`Recipe "${recipe.name}" deleted!`, "error");
        }
    }

    recipeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const recipeData = {
            id: editId || generateId(),
            name: document.getElementById('name').value,
            image: document.getElementById('image').value,
            category: document.getElementById('category').value,
            ingredients: document.getElementById('ingredients').value.split('\n').filter(line => line.trim()),
            steps: document.getElementById('steps').value.split('\n').filter(line => line.trim()),
            time: document.getElementById('time').value,
            servings: parseInt(document.getElementById('servings').value)
        };
        
        if (editId) {
            const index = recipes.findIndex(r => r.id === editId);
            recipes[index] = recipeData;
            editId = null;
            showToast(`Recipe "${recipeData.name}" updated successfully!`, "success");
        } else {
            recipes.push(recipeData);
            showToast(`Recipe "${recipeData.name}" added successfully!`, "success");
        }
        
        saveRecipes();
        recipeForm.reset();
        renderAdminRecipes();
    });

    // Admin search
    function adminSearchRecipes() {
        const searchTerm = adminSearch.value.toLowerCase().trim();
        if (searchTerm === '') {
            renderAdminRecipes(recipes);
            return;
        }
        
        const filteredRecipes = recipes.filter(recipe => {
            return (
                recipe.name.toLowerCase().includes(searchTerm) ||
                recipe.category.toLowerCase().includes(searchTerm) ||
                recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
            );
        });
        
        renderAdminRecipes(filteredRecipes);
    }

    if (adminSearchBtn) {
        adminSearchBtn.addEventListener('click', adminSearchRecipes);
    }

    if (adminSearch) {
        adminSearch.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                adminSearchRecipes();
            }
        });
    }

    renderAdminRecipes();
}