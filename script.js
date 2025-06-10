class RecipeBook {
    constructor() {
        this.recipes = [];
        this.isAdmin = false;
        this.currentView = 'user';
        this.adminPassword = 'admin123'; // Change this in production
        
        this.init();
        this.loadSampleData();
    }

    init() {
        this.bindEvents();
        this.loadRecipes();
        this.updateStats();
        this.renderRecipes();
    }

    bindEvents() {
        document.getElementById('adminBtn').addEventListener('click', () => this.showAdminInterface());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });
        
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
        
        document.getElementById('recipeForm').addEventListener('submit', (e) => this.handleRecipeSubmit(e));
        document.getElementById('editRecipeForm').addEventListener('submit', (e) => this.handleEditSubmit(e));
        
        document.getElementById('addIngredient').addEventListener('click', () => this.addIngredientField());
        document.getElementById('addStep').addEventListener('click', () => this.addStepField());
        document.getElementById('editAddIngredient').addEventListener('click', () => this.addEditIngredientField());
        document.getElementById('editAddStep').addEventListener('click', () => this.addEditStepField());
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-ingredient') || e.target.parentElement.classList.contains('remove-ingredient')) {
                this.removeIngredientField(e.target.closest('.remove-ingredient'));
            }
            if (e.target.classList.contains('remove-step') || e.target.parentElement.classList.contains('remove-step')) {
                this.removeStepField(e.target.closest('.remove-step'));
            }
            if (e.target.classList.contains('edit-remove-ingredient') || e.target.parentElement.classList.contains('edit-remove-ingredient')) {
                this.removeEditIngredientField(e.target.closest('.edit-remove-ingredient'));
            }
            if (e.target.classList.contains('edit-remove-step') || e.target.parentElement.classList.contains('edit-remove-step')) {
                this.removeEditStepField(e.target.closest('.edit-remove-step'));
            }
        });
        
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('categoryFilter').addEventListener('change', (e) => this.handleFilter(e.target.value));
        
        document.getElementById('toggleViewBtn').addEventListener('click', () => this.toggleAdminView());
    }

    loadSampleData() {
        const sampleRecipes = [
            {
                id: 1,
                name: "Classic Spaghetti Carbonara",
                category: "Main Course",
                cookingTime: 20,
                servings: 4,
                image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
                description: "A traditional Italian pasta dish with eggs, cheese, and pancetta",
                ingredients: [
                    "400g spaghetti",
                    "200g pancetta or guanciale",
                    "4 large eggs",
                    "100g Pecorino Romano cheese",
                    "Black pepper",
                    "Salt"
                ],
                steps: [
                    "Bring a large pot of salted water to boil and cook spaghetti according to package directions.",
                    "While pasta cooks, cut pancetta into small cubes and cook in a large skillet until crispy.",
                    "In a bowl, whisk together eggs, grated cheese, and plenty of black pepper.",
                    "Drain pasta, reserving 1 cup of pasta water. Add hot pasta to the skillet with pancetta.",
                    "Remove from heat and quickly stir in egg mixture, adding pasta water as needed to create a creamy sauce.",
                    "Serve immediately with extra cheese and black pepper."
                ],
                rating: 4.8
            },
            {
                id: 2,
                name: "Chocolate Chip Cookies",
                category: "Dessert",
                cookingTime: 25,
                servings: 24,
                image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
                description: "Soft and chewy chocolate chip cookies that are perfect for any occasion",
                ingredients: [
                    "2¼ cups all-purpose flour",
                    "1 tsp baking soda",
                    "1 tsp salt",
                    "1 cup butter, softened",
                    "¾ cup granulated sugar",
                    "¾ cup brown sugar",
                    "2 large eggs",
                    "2 tsp vanilla extract",
                    "2 cups chocolate chips"
                ],
                steps: [
                    "Preheat oven to 375°F (190°C).",
                    "In a bowl, whisk together flour, baking soda, and salt.",
                    "In a large bowl, cream together butter and both sugars until light and fluffy.",
                    "Beat in eggs one at a time, then add vanilla extract.",
                    "Gradually mix in the flour mixture until just combined.",
                    "Fold in chocolate chips.",
                    "Drop rounded tablespoons of dough onto ungreased baking sheets.",
                    "Bake for 9-11 minutes until golden brown around edges.",
                    "Cool on baking sheet for 5 minutes before transferring to wire rack."
                ],
                rating: 4.9
            },
            {
                id: 3,
                name: "Fresh Garden Salad",
                category: "Appetizer",
                cookingTime: 10,
                servings: 4,
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
                description: "A refreshing mix of fresh vegetables with homemade vinaigrette",
                ingredients: [
                    "6 cups mixed greens",
                    "1 cucumber, sliced",
                    "2 tomatoes, chopped",
                    "1 red onion, thinly sliced",
                    "½ cup olives",
                    "¼ cup olive oil",
                    "2 tbsp balsamic vinegar",
                    "1 tsp Dijon mustard",
                    "Salt and pepper to taste"
                ],
                steps: [
                    "Wash and dry all vegetables thoroughly.",
                    "In a large bowl, combine mixed greens, cucumber, tomatoes, and red onion.",
                    "In a small bowl, whisk together olive oil, balsamic vinegar, and Dijon mustard.",
                    "Season dressing with salt and pepper to taste.",
                    "Pour dressing over salad and toss gently to coat.",
                    "Top with olives and serve immediately."
                ],
                rating: 4.5
            }
        ];
        
        if (this.recipes.length === 0) {
            this.recipes = sampleRecipes;
            this.saveRecipes();
        }
    }

    showAdminInterface() {
        this.isAdmin = true;
        document.getElementById('adminBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('userInterface').style.display = 'block';
        this.currentView = 'admin';
        this.renderRecipes();
    }

    logout() {
        this.isAdmin = false;
        this.currentView = 'user';
        this.showUserInterface();
    }

    showUserInterface() {
        document.getElementById('adminBtn').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('userInterface').style.display = 'block';
        this.currentView = 'user';
        this.renderRecipes();
    }

    toggleAdminView() {
        const addRecipeSection = document.getElementById('addRecipeSection');
        const toggleBtn = document.getElementById('toggleViewBtn');
        
        if (addRecipeSection.style.display === 'none') {
            addRecipeSection.style.display = 'block';
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i> View Recipes';
        } else {
            addRecipeSection.style.display = 'none';
            toggleBtn.innerHTML = '<i class="fas fa-plus"></i> Add Recipe';
        }
    }

    closeModal(modal) {
        modal.style.display = 'none';
    }

    addIngredientField() {
        const ingredientsList = document.getElementById('ingredientsList');
        const newIngredient = document.createElement('div');
        newIngredient.className = 'ingredient-item';
        newIngredient.innerHTML = `
            <input type="text" placeholder="Ingredient" required>
            <button type="button" class="btn btn-danger remove-ingredient">
                <i class="fas fa-times"></i>
            </button>
        `;
        ingredientsList.appendChild(newIngredient);
    }

    removeIngredientField(button) {
        const ingredientsList = document.getElementById('ingredientsList');
        if (ingredientsList.children.length > 1) {
            button.parentElement.remove();
        }
    }

    addStepField() {
        const stepsList = document.getElementById('stepsList');
        const stepNumber = stepsList.children.length + 1;
        const newStep = document.createElement('div');
        newStep.className = 'step-item';
        newStep.innerHTML = `
            <span class="step-number">${stepNumber}.</span>
            <textarea placeholder="Describe the preparation step..." required></textarea>
            <button type="button" class="btn btn-danger remove-step">
                <i class="fas fa-times"></i>
            </button>
        `;
        stepsList.appendChild(newStep);
    }

    removeStepField(button) {
        const stepsList = document.getElementById('stepsList');
        if (stepsList.children.length > 1) {
            button.parentElement.remove();
            this.updateStepNumbers();
        }
    }

    updateStepNumbers() {
        const stepItems = document.querySelectorAll('#stepsList .step-item');
        stepItems.forEach((item, index) => {
            const stepNumber = item.querySelector('.step-number');
            stepNumber.textContent = `${index + 1}.`;
        });
    }

    addEditIngredientField() {
        const ingredientsList = document.getElementById('editIngredientsList');
        const newIngredient = document.createElement('div');
        newIngredient.className = 'ingredient-item';
        newIngredient.innerHTML = `
            <input type="text" placeholder="Ingredient" required>
            <button type="button" class="btn btn-danger edit-remove-ingredient">
                <i class="fas fa-times"></i>
            </button>
        `;
        ingredientsList.appendChild(newIngredient);
    }

    removeEditIngredientField(button) {
        const ingredientsList = document.getElementById('editIngredientsList');
        if (ingredientsList.children.length > 1) {
            button.parentElement.remove();
        }
    }

    addEditStepField() {
        const stepsList = document.getElementById('editStepsList');
        const stepNumber = stepsList.children.length + 1;
        const newStep = document.createElement('div');
        newStep.className = 'step-item';
        newStep.innerHTML = `
            <span class="step-number">${stepNumber}.</span>
            <textarea placeholder="Describe the preparation step..." required></textarea>
            <button type="button" class="btn btn-danger edit-remove-step">
                <i class="fas fa-times"></i>
            </button>
        `;
        stepsList.appendChild(newStep);
    }

    removeEditStepField(button) {
        const stepsList = document.getElementById('editStepsList');
        if (stepsList.children.length > 1) {
            button.parentElement.remove();
            this.updateEditStepNumbers();
        }
    }

    updateEditStepNumbers() {
        const stepItems = document.querySelectorAll('#editStepsList .step-item');
        stepItems.forEach((item, index) => {
            const stepNumber = item.querySelector('.step-number');
            stepNumber.textContent = `${index + 1}.`;
        });
    }

    editRecipe(id) {
        const recipe = this.recipes.find(r => r.id === id);
        if (!recipe) return;
        
        this.editingRecipeId = id;
        
        document.getElementById('editRecipeName').value = recipe.name;
        document.getElementById('editRecipeCategory').value = recipe.category;
        document.getElementById('editCookingTime').value = recipe.cookingTime;
        document.getElementById('editServings').value = recipe.servings;
        document.getElementById('editRecipeImage').value = recipe.image;
        document.getElementById('editRecipeDescription').value = recipe.description;
        
        const editIngredientsList = document.getElementById('editIngredientsList');
        editIngredientsList.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
            const ingredientDiv = document.createElement('div');
            ingredientDiv.className = 'ingredient-item';
            ingredientDiv.innerHTML = `
                <input type="text" value="${ingredient}" required>
                <button type="button" class="btn btn-danger edit-remove-ingredient">
                    <i class="fas fa-times"></i>
                </button>
            `;
            editIngredientsList.appendChild(ingredientDiv);
        });
        
        const editStepsList = document.getElementById('editStepsList');
        editStepsList.innerHTML = '';
        recipe.steps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'step-item';
            stepDiv.innerHTML = `
                <span class="step-number">${index + 1}.</span>
                <textarea required>${step}</textarea>
                <button type="button" class="btn btn-danger edit-remove-step">
                    <i class="fas fa-times"></i>
                </button>
            `;
            editStepsList.appendChild(stepDiv);
        });
        
        document.getElementById('editModal').style.display = 'block';
    }

    handleEditSubmit(e) {
        e.preventDefault();
        
        const recipe = this.recipes.find(r => r.id === this.editingRecipeId);
        if (!recipe) return;
        
        recipe.name = document.getElementById('editRecipeName').value;
        recipe.category = document.getElementById('editRecipeCategory').value;
        recipe.cookingTime = parseInt(document.getElementById('editCookingTime').value);
        recipe.servings = parseInt(document.getElementById('editServings').value);
        recipe.image = document.getElementById('editRecipeImage').value || 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400';
        recipe.description = document.getElementById('editRecipeDescription').value;
        
        recipe.ingredients = [];
        const editIngredientInputs = document.querySelectorAll('#editIngredientsList input');
        editIngredientInputs.forEach(input => {
            if (input.value.trim()) {
                recipe.ingredients.push(input.value.trim());
            }
        });
        
        recipe.steps = [];
        const editStepTextareas = document.querySelectorAll('#editStepsList textarea');
        editStepTextareas.forEach(textarea => {
            if (textarea.value.trim()) {
                recipe.steps.push(textarea.value.trim());
            }
        });
        
        this.saveRecipes();
        this.renderRecipes();
        this.updateStats();
        this.closeModal(document.getElementById('editModal'));
        
        alert('Recipe updated successfully!');
    }

    handleRecipeSubmit(e) {
        e.preventDefault();
        
        const recipe = {
            id: Date.now(),
            name: document.getElementById('recipeName').value,
            category: document.getElementById('recipeCategory').value,
            cookingTime: parseInt(document.getElementById('cookingTime').value),
            servings: parseInt(document.getElementById('servings').value),
            image: document.getElementById('recipeImage').value || 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400',
            description: document.getElementById('recipeDescription').value,
            ingredients: [],
            steps: [],
            rating: 0
        };

        const ingredientInputs = document.querySelectorAll('#ingredientsList input');
        ingredientInputs.forEach(input => {
            if (input.value.trim()) {
                recipe.ingredients.push(input.value.trim());
            }
        });

        const stepTextareas = document.querySelectorAll('#stepsList textarea');
        stepTextareas.forEach(textarea => {
            if (textarea.value.trim()) {
                recipe.steps.push(textarea.value.trim());
            }
        });

        this.recipes.push(recipe);
        this.saveRecipes();
        this.renderRecipes();
        this.updateStats();
        this.resetForm();
        
        alert('Recipe added successfully!');
    }

    resetForm() {
        document.getElementById('recipeForm').reset();
        
        const ingredientsList = document.getElementById('ingredientsList');
        ingredientsList.innerHTML = `
            <div class="ingredient-item">
                <input type="text" placeholder="Ingredient" required>
                <button type="button" class="btn btn-danger remove-ingredient">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        const stepsList = document.getElementById('stepsList');
        stepsList.innerHTML = `
            <div class="step-item">
                <span class="step-number">1.</span>
                <textarea placeholder="Describe the preparation step..." required></textarea>
                <button type="button" class="btn btn-danger remove-step">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }

    renderRecipes(recipesToRender = null) {
        const recipesGrid = document.getElementById('recipesGrid');
        const recipes = recipesToRender || this.recipes;
        
        if (recipes.length === 0) {
            recipesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-utensils"></i>
                    <h3>No recipes found</h3>
                    <p>Start by adding your first recipe!</p>
                </div>
            `;
            return;
        }
        
        recipesGrid.innerHTML = recipes.map(recipe => `
            <div class="recipe-card" data-id="${recipe.id}">
                <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image" onerror="this.src='https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400'">
                <div class="recipe-content">
                    <div class="recipe-header">
                        <h3 class="recipe-title">${recipe.name}</h3>
                        <span class="recipe-category">${recipe.category}</span>
                    </div>
                    <p class="recipe-description">${recipe.description}</p>
                    <div class="recipe-meta">
                        <span><i class="fas fa-clock"></i> ${recipe.cookingTime} min</span>
                        <span><i class="fas fa-users"></i> ${recipe.servings} servings</span>
                    </div>
                    <div class="recipe-rating">
                        ${this.renderStars(recipe.rating, recipe.id)}
                    </div>
                    <div class="recipe-actions">
                        <button class="view-btn" onclick="recipeBook.viewRecipe(${recipe.id})">
                            <i class="fas fa-eye"></i> View Recipe
                        </button>
                        ${this.isAdmin ? `
                            <button class="edit-btn" onclick="recipeBook.editRecipe(${recipe.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-btn" onclick="recipeBook.deleteRecipe(${recipe.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderStars(rating, recipeId) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            const isActive = i <= Math.round(rating);
            starsHtml += `<span class="star ${isActive ? 'active' : ''}" onclick="recipeBook.rateRecipe(${recipeId}, ${i})">★</span>`;
        }
        return starsHtml;
    }

    viewRecipe(id) {
        const recipe = this.recipes.find(r => r.id === id);
        if (!recipe) return;
        
        const modal = document.getElementById('recipeModal');
        const recipeDetail = document.getElementById('recipeDetail');
        
        recipeDetail.innerHTML = `
            <div class="recipe-detail-content">
                <div class="recipe-detail-header">
                    <img src="${recipe.image}" alt="${recipe.name}" class="recipe-detail-image" onerror="this.src='https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400'">
                    <h2 class="recipe-detail-title">${recipe.name}</h2>
                    <div class="recipe-detail-meta">
                        <span><i class="fas fa-tag"></i> ${recipe.category}</span>
                        <span><i class="fas fa-clock"></i> ${recipe.cookingTime} minutes</span>
                        <span><i class="fas fa-users"></i> ${recipe.servings} servings</span>
                        <span><i class="fas fa-star"></i> ${recipe.rating.toFixed(1)}/5</span>
                    </div>
                    <p class="recipe-detail-description">${recipe.description}</p>
                </div>
                
                <div class="ingredients-list">
                    <h3><i class="fas fa-list"></i> Ingredients</h3>
                    <ul>
                        ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="steps-list">
                    <h3><i class="fas fa-clipboard-list"></i> Preparation Steps</h3>
                    <ol>
                        ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                
                <button class="print-btn" onclick="window.print()">
                    <i class="fas fa-print"></i> Print Recipe
                </button>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    deleteRecipe(id) {
        if (confirm('Are you sure you want to delete this recipe?')) {
            this.recipes = this.recipes.filter(recipe => recipe.id !== id);
            this.saveRecipes();
            this.renderRecipes();
            this.updateStats();
        }
    }

    rateRecipe(id, rating) {
        const recipe = this.recipes.find(r => r.id === id);
        if (recipe) {
            recipe.rating = rating;
            this.saveRecipes();
            this.renderRecipes();
            this.updateStats();
        }
    }

    handleSearch(query) {
        const filteredRecipes = this.recipes.filter(recipe => 
            recipe.name.toLowerCase().includes(query.toLowerCase()) ||
            recipe.description.toLowerCase().includes(query.toLowerCase()) ||
            recipe.ingredients.some(ingredient => 
                ingredient.toLowerCase().includes(query.toLowerCase())
            )
        );
        this.renderRecipes(filteredRecipes);
    }

    handleFilter(category) {
        if (!category) {
            this.renderRecipes();
            return;
        }
        
        const filteredRecipes = this.recipes.filter(recipe => recipe.category === category);
        this.renderRecipes(filteredRecipes);
    }

    updateStats() {
        const totalRecipes = this.recipes.length;
        const avgRating = totalRecipes > 0 ? 
            (this.recipes.reduce((sum, recipe) => sum + recipe.rating, 0) / totalRecipes).toFixed(1) : 
            '0.0';
        const categories = [...new Set(this.recipes.map(recipe => recipe.category))].length;
        
        document.getElementById('totalRecipes').textContent = totalRecipes;
        document.getElementById('avgRating').textContent = avgRating;
        document.getElementById('totalCategories').textContent = categories;
    }

    saveRecipes() {
        console.log('Recipes saved:', this.recipes);
    }

    loadRecipes() {
        console.log('Recipes loaded:', this.recipes);
    }
}

const recipeBook = new RecipeBook();