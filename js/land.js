
"use strict";

//**************** STATIC VARIABLES *****************//

// categories
const cereals = ["Wheat and products", "Rice and products", "Barley and products", "Maize and products",
    "Rye and products", "Oats", "Millet and products", "Sorghum and products", "Cereals, Other"];
const roots = ["Cassava and products", "Potatoes and products", "Sweet potatoes", "Yams", "Roots, Other"];
const sweeteners = ["Sugar cane", "Sugar beet", "Sugar non-centrifugal", "Sugar (Raw Equivalent)", "Sweeteners, Other"]
const pulses = ["Honey", "Beans", "Peas", "Pulses, Other and products"] // to change
const oilcrops = ["Nuts and products", "Soyabeans", "Groundnuts (Shelled Eq)", "Sunflower seed", "Rape and Mustardseed", "Cottonseed",
    "Coconut - Incl Copra", "Sesame Seed", "Palm kernels", "Olives (including preserved)", "Oilcrops, Other"];
const oils = ["Soyabean Oil", "Groundnut Oil", "Sunflowerseed Oil", "Rape and Mustard Oil", "Cottonseed Oil", "Palmkernel Oil", "Palm Oil",
    "Coconut Oil", "Sesameseed Oil", "Olive Oil", "Ricebran Oil", "Maize Germ oil", "Oilcrops Oil, Other"];
const vegetables = ["Tomatoes and products", "Onions", "Vegetables, Other"];
const fruits = ["Oranges, Mandarines", "Lemons, Limes and products", "Grapefruit and products", "Citrus,Others", "Bananas", "Plantains",
    "Apples and products", "Pineapples and products", "Dates", "Grapes and products (excl wine)", "Fruits, Other"];
const spices = ["Coffee and products", "Cacao Beans and products", "Tea (including mate)", "Pepper", "Pimento", "Cloves", "Spices, Other"];
const beverages = ["Wine", "Beer", "Beverages, Fermented", "Beverages, Alcoholic", "Alcohol, Non-Food"];
const meat = ["Bovine Meat", "Mutton & Goat Meat", "Pigmeat", "Poultry Meat", "Meat, Other", "Meat, Aquatic Mammals"];
const fish = ["Freshwater Fish", "Demersal Fish", "Pelagic Fish", "Marine Fish, Other", "Crustaceans", "Cephalopods", "Molluscs, Other"];
const others = ["Offals, Edible", "Butter, Ghee", "Cream", "Fats, Animals, Raw", "Fish, Body Oil", "Fish, Liver Oil", "Eggs",
    "Milk - Excluding Butter"];


const cat1 = {
    name: "Primary",
    id: "carrot_svg",
    img: "carrot",
    source: '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 59.017 59.017" style="enable-background:new 0 0 59.017 59.017;" xml:space="preserve"><g><path d="M53.501,17.594c-1.003,0.95-2.211,1.872-3.59,2.741l-0.585,0.368l-0.685,0.076c-2.132,0.234-4.308,1.038-6.085,1.868c0.841-0.143,1.743-0.237,2.676-0.237c4.087,0,7.47,1.729,10.063,5.15l0.134,0.179c0.167,0.229,0.422,0.375,0.704,0.405c0.035,0.003,0.069,0.005,0.104,0.005c0.245,0,0.483-0.09,0.668-0.256c0.347-0.312,0.618-0.597,0.853-0.897c2.034-2.607,1.153-5.051,0.458-5.904c-1.177-1.771-2.692-3.002-4.518-3.701C53.63,17.458,53.571,17.527,53.501,17.594z" /><path d="M30.581,3.871c1.401,0.517,2.501,1.487,2.583,1.555c3.519,2.607,4.578,5.918,4.532,9.054c0.56-1.426,1.011-2.967,1.131-4.426l0.057-0.694l0.356-0.598c0.686-1.147,1.371-2.135,2.097-3.022l0.528-0.506c0.021-0.015,0.055-0.04,0.098-0.071c-0.656-1.344-1.66-2.471-3.021-3.356c-0.339-0.271-2.008-1.505-4.241-1.505c-0.966,0-1.908,0.23-2.801,0.684c-0.63,0.32-1.2,0.742-1.693,1.252c-0.235,0.243-0.332,0.588-0.256,0.917C30.028,3.484,30.264,3.753,30.581,3.871z" /><path d="M55.937,30.134c-0.853-0.089-1.623-0.531-2.122-1.215l-0.119-0.157c-2.692-3.552-6.202-4.927-10.804-4.144l-0.882,0.151c-1.189-0.447-2.479-0.871-3.859-1.269c0.022-0.097,0.03-0.198,0.022-0.301c-0.011-0.135-0.057-0.259-0.117-0.375c0.69-0.435,2.045-1.243,3.754-2.032c0.058-0.024,0.117-0.048,0.176-0.075c-0.009,0.002-0.018,0.004-0.027,0.005c1.891-0.862,4.187-1.681,6.461-1.931l0.229-0.025l0.195-0.123c1.269-0.799,2.373-1.641,3.282-2.502c1.757-1.663,2.6-3.44,2.505-5.282C54.486,8.04,52.147,6.213,52,6.103c-1.071-0.727-2.282-1.096-3.599-1.096c-2.859,0-5.239,1.755-5.339,1.83l-0.176,0.168c-0.664,0.813-1.294,1.723-1.927,2.781l-0.119,0.2l-0.019,0.231c-0.131,1.595-0.59,3.239-1.171,4.764c0.001-0.011,0.002-0.022,0.003-0.034c-0.034,0.088-0.059,0.173-0.094,0.262l-0.087,0.222c-0.936,2.328-2.115,4.33-2.773,5.367l-0.091,0.144l-0.039,0.166c-0.064,0.277-0.117,0.516-0.157,0.702c-0.24-0.926-0.503-1.815-0.784-2.669l0.068-4.691c0.045-3.103-1.172-5.529-3.723-7.417l-0.084-0.066c-0.266-0.226-1.074-0.877-2-1.219c-0.954-0.353-1.659-1.154-1.887-2.145c-0.156-0.683-0.053-1.374,0.244-1.982c-0.303,0.046-0.599,0.113-0.884,0.214c-1.552,0.55-2.568,1.871-2.718,3.535c-0.16,1.769,0.732,3.482,2.271,4.365c1.409,0.808,3.097,2.304,4.666,5.048c-0.935-0.064-1.837,0.035-2.688,0.341c-1.066,0.383-2.798,1.992-4.895,4.367l0.655,2.255c0.016,0.056,0.027,0.112,0.034,0.17c0.179,1.632,1.022,3.747,2.505,4.792c0.451,0.318,0.559,0.942,0.24,1.394c-0.194,0.276-0.504,0.423-0.818,0.423c-0.199,0-0.4-0.059-0.576-0.183c-2.095-1.478-3.098-4.197-3.33-6.119l-0.265-0.912c-1.872,2.258-3.948,4.971-6.067,7.905l0.364,3.16c0.113,1.031,0.635,2.354,1.55,3c0.451,0.318,0.559,0.942,0.24,1.394c-0.195,0.276-0.504,0.423-0.818,0.423c-0.199,0-0.4-0.059-0.576-0.183c-1.521-1.073-2.235-3.047-2.384-4.411l-0.109-0.948c-6.344,9.03-12.644,19.34-14.493,24.301c-0.257,0.688-0.186,1.397,0.194,1.945c0.361,0.52,0.945,0.818,1.603,0.818h0c0.271,0,0.544-0.051,0.814-0.152c3.815-1.422,10.759-5.422,17.865-10.042l-1.336-0.35c-1.36-0.167-3.281-0.883-4.333-2.375c-0.318-0.452-0.211-1.075,0.24-1.394c0.452-0.32,1.076-0.21,1.394,0.24c0.646,0.915,1.969,1.437,2.994,1.549c0.049,0.005,0.097,0.014,0.145,0.027l3.147,0.825c3.613-2.404,7.18-4.914,10.326-7.277h-1.077c-0.037,0-0.073-0.002-0.109-0.006c-1.926-0.211-4.708-1.213-6.208-3.341c-0.318-0.451-0.21-1.075,0.241-1.394c0.45-0.318,1.075-0.211,1.394,0.241c1.034,1.466,3.115,2.308,4.74,2.499h3.625c4.305-3.388,7.398-6.276,7.941-7.789c0.245-0.682,0.361-1.396,0.37-2.133c2.742,1.342,4.192,2.647,4.948,3.684c1.099,1.508,2.881,2.446,4.651,2.446c1.501,0,2.833-0.678,3.654-1.861c0.613-0.882,0.801-1.799,0.756-2.649c-0.536,0.437-1.199,0.684-1.892,0.684C56.137,30.149,56.037,30.144,55.937,30.134zM9.926,49.304c-0.171,0.359-0.53,0.569-0.903,0.569c-0.145,0-0.292-0.031-0.431-0.098c-0.786-0.375-1.549-0.833-2.267-1.36c-0.445-0.327-0.542-0.953-0.215-1.397c0.327-0.445,0.952-0.542,1.397-0.215c0.618,0.453,1.273,0.846,1.947,1.168C9.953,48.209,10.164,48.806,9.926,49.304z M40.958,30.229c-0.152,0.399-0.532,0.645-0.935,0.645c-0.119,0-0.239-0.021-0.356-0.066c-2.363-0.901-4.533-2.495-6.45-4.737c-0.359-0.42-0.31-1.051,0.11-1.41c0.42-0.358,1.051-0.31,1.41,0.11c1.697,1.985,3.595,3.388,5.642,4.167C40.896,29.135,41.155,29.713,40.958,30.229z" /></g></svg>',
    // source: '<g><path d="M53.501,17.594c-1.003,0.95-2.211,1.872-3.59,2.741l-0.585,0.368l-0.685,0.076c-2.132,0.234-4.308,1.038-6.085,1.868c0.841-0.143,1.743-0.237,2.676-0.237c4.087,0,7.47,1.729,10.063,5.15l0.134,0.179c0.167,0.229,0.422,0.375,0.704,0.405c0.035,0.003,0.069,0.005,0.104,0.005c0.245,0,0.483-0.09,0.668-0.256c0.347-0.312,0.618-0.597,0.853-0.897c2.034-2.607,1.153-5.051,0.458-5.904c-1.177-1.771-2.692-3.002-4.518-3.701C53.63,17.458,53.571,17.527,53.501,17.594z" /><path d="M30.581,3.871c1.401,0.517,2.501,1.487,2.583,1.555c3.519,2.607,4.578,5.918,4.532,9.054c0.56-1.426,1.011-2.967,1.131-4.426l0.057-0.694l0.356-0.598c0.686-1.147,1.371-2.135,2.097-3.022l0.528-0.506c0.021-0.015,0.055-0.04,0.098-0.071c-0.656-1.344-1.66-2.471-3.021-3.356c-0.339-0.271-2.008-1.505-4.241-1.505c-0.966,0-1.908,0.23-2.801,0.684c-0.63,0.32-1.2,0.742-1.693,1.252c-0.235,0.243-0.332,0.588-0.256,0.917C30.028,3.484,30.264,3.753,30.581,3.871z" /><path d="M55.937,30.134c-0.853-0.089-1.623-0.531-2.122-1.215l-0.119-0.157c-2.692-3.552-6.202-4.927-10.804-4.144l-0.882,0.151c-1.189-0.447-2.479-0.871-3.859-1.269c0.022-0.097,0.03-0.198,0.022-0.301c-0.011-0.135-0.057-0.259-0.117-0.375c0.69-0.435,2.045-1.243,3.754-2.032c0.058-0.024,0.117-0.048,0.176-0.075c-0.009,0.002-0.018,0.004-0.027,0.005c1.891-0.862,4.187-1.681,6.461-1.931l0.229-0.025l0.195-0.123c1.269-0.799,2.373-1.641,3.282-2.502c1.757-1.663,2.6-3.44,2.505-5.282C54.486,8.04,52.147,6.213,52,6.103c-1.071-0.727-2.282-1.096-3.599-1.096c-2.859,0-5.239,1.755-5.339,1.83l-0.176,0.168c-0.664,0.813-1.294,1.723-1.927,2.781l-0.119,0.2l-0.019,0.231c-0.131,1.595-0.59,3.239-1.171,4.764c0.001-0.011,0.002-0.022,0.003-0.034c-0.034,0.088-0.059,0.173-0.094,0.262l-0.087,0.222c-0.936,2.328-2.115,4.33-2.773,5.367l-0.091,0.144l-0.039,0.166c-0.064,0.277-0.117,0.516-0.157,0.702c-0.24-0.926-0.503-1.815-0.784-2.669l0.068-4.691c0.045-3.103-1.172-5.529-3.723-7.417l-0.084-0.066c-0.266-0.226-1.074-0.877-2-1.219c-0.954-0.353-1.659-1.154-1.887-2.145c-0.156-0.683-0.053-1.374,0.244-1.982c-0.303,0.046-0.599,0.113-0.884,0.214c-1.552,0.55-2.568,1.871-2.718,3.535c-0.16,1.769,0.732,3.482,2.271,4.365c1.409,0.808,3.097,2.304,4.666,5.048c-0.935-0.064-1.837,0.035-2.688,0.341c-1.066,0.383-2.798,1.992-4.895,4.367l0.655,2.255c0.016,0.056,0.027,0.112,0.034,0.17c0.179,1.632,1.022,3.747,2.505,4.792c0.451,0.318,0.559,0.942,0.24,1.394c-0.194,0.276-0.504,0.423-0.818,0.423c-0.199,0-0.4-0.059-0.576-0.183c-2.095-1.478-3.098-4.197-3.33-6.119l-0.265-0.912c-1.872,2.258-3.948,4.971-6.067,7.905l0.364,3.16c0.113,1.031,0.635,2.354,1.55,3c0.451,0.318,0.559,0.942,0.24,1.394c-0.195,0.276-0.504,0.423-0.818,0.423c-0.199,0-0.4-0.059-0.576-0.183c-1.521-1.073-2.235-3.047-2.384-4.411l-0.109-0.948c-6.344,9.03-12.644,19.34-14.493,24.301c-0.257,0.688-0.186,1.397,0.194,1.945c0.361,0.52,0.945,0.818,1.603,0.818h0c0.271,0,0.544-0.051,0.814-0.152c3.815-1.422,10.759-5.422,17.865-10.042l-1.336-0.35c-1.36-0.167-3.281-0.883-4.333-2.375c-0.318-0.452-0.211-1.075,0.24-1.394c0.452-0.32,1.076-0.21,1.394,0.24c0.646,0.915,1.969,1.437,2.994,1.549c0.049,0.005,0.097,0.014,0.145,0.027l3.147,0.825c3.613-2.404,7.18-4.914,10.326-7.277h-1.077c-0.037,0-0.073-0.002-0.109-0.006c-1.926-0.211-4.708-1.213-6.208-3.341c-0.318-0.451-0.21-1.075,0.241-1.394c0.45-0.318,1.075-0.211,1.394,0.241c1.034,1.466,3.115,2.308,4.74,2.499h3.625c4.305-3.388,7.398-6.276,7.941-7.789c0.245-0.682,0.361-1.396,0.37-2.133c2.742,1.342,4.192,2.647,4.948,3.684c1.099,1.508,2.881,2.446,4.651,2.446c1.501,0,2.833-0.678,3.654-1.861c0.613-0.882,0.801-1.799,0.756-2.649c-0.536,0.437-1.199,0.684-1.892,0.684C56.137,30.149,56.037,30.144,55.937,30.134zM9.926,49.304c-0.171,0.359-0.53,0.569-0.903,0.569c-0.145,0-0.292-0.031-0.431-0.098c-0.786-0.375-1.549-0.833-2.267-1.36c-0.445-0.327-0.542-0.953-0.215-1.397c0.327-0.445,0.952-0.542,1.397-0.215c0.618,0.453,1.273,0.846,1.947,1.168C9.953,48.209,10.164,48.806,9.926,49.304z M40.958,30.229c-0.152,0.399-0.532,0.645-0.935,0.645c-0.119,0-0.239-0.021-0.356-0.066c-2.363-0.901-4.533-2.495-6.45-4.737c-0.359-0.42-0.31-1.051,0.11-1.41c0.42-0.358,1.051-0.31,1.41,0.11c1.697,1.985,3.595,3.388,5.642,4.167C40.896,29.135,41.155,29.713,40.958,30.229z" /></g>',
    columns: ["fruits", "vegetables", "cereals", "oilcrops"]
}
const cat2 = {
    name: "Animals",
    id: "cow_svg",
    img: "cow",
    source: '<svg id="Capa_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g><path d="m497 46c-8.291 0-15 6.709-15 15v30c0 8.284-6.716 15-15 15h-121c-8.284 0-15-6.716-15-15v-30c0-8.291-6.709-15-15-15s-15 6.709-15 15v30c0 19.757 12.878 36.392 30.619 42.429 2.728 66.476 29.282 109.858 30.963 114.28 2.549 5.083 7.734 8.291 13.418 8.291h61c5.684 0 10.869-3.208 13.418-8.291 2.175-5.709 27.768-45.249 30.877-114.254 17.785-6.012 30.705-22.667 30.705-42.455v-30c0-8.291-6.709-15-15-15z"/><path d="m391 301v-15h-15c-17.139 0-32.549-9.521-40.239-24.844-.577-1.196 2.076 4.33-5.62-11.656-3.99 20.755-22.238 36.5-44.141 36.5h-60c-20.273 0-37.456-13.477-43.066-31.934-20.598-6.262-34.993-26.935-31.375-50.233 3.468-22.343 24.47-37.833 47.08-37.833h27.361c19.556 0 36.24 12.539 42.437 30h17.563c10.232 0 19.565 3.565 27.133 9.338-5.07-17.402-8.589-35.266-10.422-53.309-15.223-10.831-26.332-27.087-30.192-46.029h-106.519c-28.499 0-55.313 11.501-74.251 30h-16.749c-41.422 0-75 33.578-75 75v30c0 8.291 6.709 15 15 15s15-6.709 15-15v-30c0-23.196 17.703-42.122 40.272-44.522-6.408 13.568-10.272 28.552-10.272 44.522v15h46c24.814 0 45 20.186 45 45s-20.186 45-45 45h-46v135c0 8.284 6.716 15 15 15h31c8.284 0 15-6.716 15-15v-90c0-8.286 6.716-15 15-15h135l13.359 106.86c.939 7.505 7.319 13.14 14.885 13.14h16.756c8.284 0 15-6.716 15-15v-90c0-8.555 7.097-14.885 15.652-15.007 24.514-.348 44.348-20.396 44.348-44.993z"/><path d="m121 271c0-8.276-6.724-15-15-15h-46v30h46c8.276 0 15-6.724 15-15z"/><path d="m151 451c0 8.284 6.716 15 15 15h20.51c7.564 0 13.945-5.632 14.883-13.138l9.607-76.862h-60z"/><path d="m256 226c-8.291 0-15-6.709-15-15 0-8.276-6.724-15-15-15h-30c-8.276 0-15 6.724-15 15s6.724 15 15 15c8.524 0 15.374 7.09 14.984 15.699-.363 8.017 6.992 14.301 15.016 14.301h60c8.276 0 15-6.724 15-15s-6.724-15-15-15z"/><path d="m361 374.491v76.509c0 8.284 6.716 15 15 15h30c8.284 0 15-6.716 15-15v-150c0 36.226-25.811 66.519-60 73.491z"/></g></svg>',
    columns: ["meat", "fish"]
}
const cat3 = {
    name: "Extracted",
    id: "oil_svg",
    img: "olive-oil",
    source: '<svg id="Solid" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><ellipse cx="311.635" cy="440" rx="32" ry="40"/><circle cx="96" cy="448" r="8"/><path d="m296 387.066v-171.066h-144v188.641c18.9 7.718 32 24.25 32 43.359 0 11.959-5.141 22.9-13.613 31.315a23.949 23.949 0 0 0 5.613.685h96a24.182 24.182 0 0 0 5.526-.645c-8.581-10.122-13.891-24.027-13.891-39.355 0-24.493 13.553-45.349 32.365-52.934zm-120-115.066a8 8 0 1 1 8-8 8 8 0 0 1 -8 8zm24 24a8 8 0 1 1 8-8 8 8 0 0 1 -8 8zm0-48a8 8 0 1 1 8-8 8 8 0 0 1 -8 8z"/><path d="m296 175.942a23.95 23.95 0 0 0 -16.406-22.758l-16.414-5.471a24.093 24.093 0 0 1 -16.261-20.113l-5.288-47.6h-35.36l-5.19 46.713a24.089 24.089 0 0 1 -16.253 20.114l-16.418 5.473a23.951 23.951 0 0 0 -16.41 22.76v24.94h144z"/><path d="m128 416a45.736 45.736 0 0 0 -27.115 8.5 24 24 0 0 1 0 47 45.736 45.736 0 0 0 27.115 8.5c22.056 0 40-14.355 40-32s-17.944-32-40-32z"/><path d="m200 32h48v32h-48z"/><path d="m438.553 251.207a7.9 7.9 0 0 0 -2.094-7.666 7.988 7.988 0 0 0 -5.584-2.363 8.435 8.435 0 0 0 -2.082.269c-11.456 2.918-22.207 9.339-31.952 19.084-16.841 16.839-29.661 42.669-36.841 59.469 16.8-7.18 42.63-20 59.469-36.842 9.745-9.745 16.166-20.495 19.084-31.951z"/><path d="m356.3 419.531a64.7 64.7 0 0 1 1.208 36.959 48.607 48.607 0 0 0 7.679 9.952c7.747 7.747 17.462 12.51 27.356 13.41 9.347.847 17.713-1.9 23.56-7.749 12.477-12.477 9.938-35.318-5.66-50.915-7.742-7.744-17.454-12.5-27.347-13.4-9.348-.845-17.713 1.9-23.559 7.75a25.613 25.613 0 0 0 -3.237 3.993z"/><path d="m356.231 397.984a43.96 43.96 0 0 1 15.017-5.548l-11.248-33.736v-102.7a8 8 0 0 0 -16 0v100.15l-34.913 27.93q1.266-.078 2.548-.08a41.857 41.857 0 0 1 18.03 4.115l18.375-14.7z"/></svg>',
    columns: ["oils", "sweeteners"]
}
const cat4 = {
    name: "Other",
    id: "ginger_svg",
    img: "ginger",
    source: '<svg xmlns="http://www.w3.org/2000/svg" height="867pt" version="1.1" viewBox="0 -70 867.50158 867" width="867pt"><g id="surface1"><path d="M 166.597656 238.339844 C 195.558594 255.730469 231.757812 255.730469 260.71875 238.339844 L 278.441406 227.691406 L 284.011719 172.007812 C 285.507812 157.050781 280.605469 142.15625 270.527344 130.996094 C 260.445312 119.851562 246.117188 113.488281 231.078125 113.476562 L 196.289062 113.476562 C 181.222656 113.394531 166.84375 119.765625 156.804688 130.992188 C 155.328125 132.769531 153.949219 134.632812 152.695312 136.578125 L 179.410156 152.640625 C 202.300781 166.390625 230.066406 169.4375 255.398438 160.988281 L 265.234375 190.5625 C 231.289062 201.925781 194.070312 197.839844 163.394531 179.394531 L 143.277344 167.332031 C 143.277344 168.882812 143.113281 170.4375 143.277344 172.070312 L 148.855469 227.757812 Z M 166.597656 238.339844 " style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" /><path d="M 429.878906 87.738281 C 470.082031 66.863281 515.746094 58.898438 560.648438 64.933594 C 560.347656 61.589844 560.234375 58.238281 559.855469 54.894531 C 557.699219 35.566406 546.523438 18.390625 529.710938 8.605469 C 512.90625 -1.1875 492.449219 -2.445312 474.582031 5.21875 L 463.960938 9.765625 C 437.328125 21.285156 422.332031 49.792969 427.917969 78.257812 Z M 429.878906 87.738281 " style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" /><path d="M 436.273438 119.703125 L 442.894531 152.773438 C 474.746094 136.714844 511.710938 134.09375 545.515625 145.476562 L 535.675781 175.070312 C 509.691406 166.351562 481.308594 168.363281 456.828125 180.683594 L 449.210938 184.484375 L 460.644531 241.566406 C 462.011719 243.464844 463.445312 245.332031 464.652344 247.375 L 471.992188 259.589844 C 481.449219 275.179688 498.34375 284.695312 516.578125 284.71875 L 518.523438 284.71875 L 531.5 253.589844 C 552.125 203.851562 562.554688 150.480469 562.175781 96.652344 C 518.800781 89.484375 474.296875 97.636719 436.273438 119.703125 Z M 436.273438 119.703125 " style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" /><path d="M 799.4375 96.800781 L 826.085938 80.148438 C 813.554688 65.605469 798.601562 53.34375 781.878906 43.90625 C 757.683594 30.472656 728.464844 29.632812 703.539062 41.652344 C 678.605469 53.671875 661.066406 77.050781 656.515625 104.355469 L 652.046875 131.132812 C 703.621094 136.300781 755.457031 124.234375 799.4375 96.800781 Z M 799.4375 96.800781 " style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" /><path d="M 218.222656 553.933594 C 241.519531 530.703125 279.210938 530.703125 302.503906 553.933594 L 314.402344 565.820312 C 331.148438 582.605469 355.816406 588.722656 378.460938 581.699219 C 356.230469 563.363281 347.265625 533.4375 355.730469 505.902344 C 364.199219 478.363281 388.433594 458.644531 417.125 455.96875 C 422.367188 385.554688 399.203125 315.980469 352.796875 262.753906 L 331.148438 238.019531 L 325.273438 238.019531 C 319.5 238.148438 313.785156 239.253906 308.371094 241.285156 L 297.617188 348.839844 C 294.675781 378.402344 276.316406 404.195312 249.359375 416.671875 C 275.867188 437.347656 291.402344 469.050781 291.496094 502.667969 L 260.359375 502.667969 C 260.300781 478.1875 248.777344 455.140625 229.230469 440.398438 L 207.730469 424.269531 C 192.703125 423.289062 178.21875 418.261719 165.820312 409.730469 C 152.910156 419.433594 137.21875 424.722656 121.066406 424.832031 L 116.953125 424.832031 C 149.789062 482.800781 167.015625 548.300781 166.957031 614.929688 L 166.957031 658.34375 L 193.808594 658.34375 C 203.398438 658.328125 212.726562 655.261719 220.464844 649.613281 L 225.75 645.753906 L 218.222656 638.214844 C 194.980469 614.929688 194.980469 577.21875 218.222656 553.933594 Z M 218.222656 553.933594 " style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" /><path d="M 491.265625 573.578125 L 465.355469 556.296875 L 489.003906 520.855469 L 467.90625 507.417969 L 444.554688 542.441406 L 418.65625 525.160156 L 441.414062 491.019531 C 422.699219 481.921875 400.121094 488.609375 389.394531 506.453125 C 378.675781 524.296875 383.351562 547.375 400.175781 559.632812 L 425.082031 577.714844 C 444.917969 580.8125 463.257812 590.125 477.449219 604.308594 L 486.792969 613.644531 C 489.277344 616.207031 491.523438 618.980469 493.519531 621.925781 C 507.53125 624.34375 521.769531 619.117188 530.882812 608.199219 L 534.652344 603.671875 C 542.0625 594.78125 545.273438 583.132812 543.492188 571.699219 C 541.707031 560.265625 535.078125 550.160156 525.308594 543.957031 L 515.195312 537.511719 Z M 491.265625 573.578125 " style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" /><path d="M 516.578125 315.855469 C 487.386719 315.777344 460.351562 300.46875 445.277344 275.484375 L 437.949219 263.273438 C 428.507812 247.636719 411.601562 238.0625 393.339844 238.019531 L 372.453125 238.019531 L 376.1875 242.285156 C 428.46875 302.261719 454.339844 380.789062 447.949219 460.085938 C 452.902344 461.828125 457.65625 464.101562 462.117188 466.859375 L 482.941406 480.113281 L 597.246094 458.683594 C 578.105469 407.257812 551.160156 359.082031 517.351562 315.855469 Z M 516.578125 315.855469 " style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" /><path d="M 455.410156 626.335938 C 438.296875 609.078125 412.867188 603.046875 389.820312 610.765625 C 355.613281 622.324219 317.820312 613.398438 292.386719 587.773438 L 280.484375 575.878906 C 269.308594 565.167969 251.609375 565.355469 240.660156 576.3125 C 229.707031 587.257812 229.523438 604.953125 240.230469 616.148438 L 244.792969 620.703125 L 264.921875 600.574219 L 286.941406 622.582031 L 266.804688 642.777344 L 304.167969 680.140625 C 328.15625 646.8125 366.757812 627.101562 407.820312 627.210938 L 431.605469 627.210938 L 431.605469 658.34375 L 407.820312 658.34375 C 374.972656 658.269531 344.359375 674.925781 326.566406 702.542969 L 340.578125 716.550781 C 344.238281 720.210938 348.820312 722.800781 353.828125 724.054688 C 380.582031 730.679688 408.871094 723.988281 429.820312 706.085938 L 463.210938 677.460938 C 469.21875 672.296875 472.804688 664.851562 473.105469 656.933594 C 473.390625 649.011719 470.375 641.332031 464.765625 635.722656 Z M 455.410156 626.335938 " style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" /><path d="M 683.480469 292.828125 C 672.386719 292.828125 661.304688 292.144531 650.292969 290.769531 L 609.046875 285.609375 C 595.851562 302.09375 576.652344 312.667969 555.671875 315.011719 C 585.976562 357.195312 610.316406 403.351562 628.023438 452.179688 C 667.613281 442.679688 705.941406 428.542969 742.214844 410.042969 L 673.839844 376.570312 L 687.535156 348.554688 L 775.265625 391.515625 C 829.894531 356.421875 864.160156 297.0625 867.203125 232.199219 L 802.117188 264.777344 C 765.296875 283.222656 724.660156 292.828125 683.480469 292.828125 Z M 683.480469 292.828125 " style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" /><path d="M 675.175781 163.589844 C 665.464844 163.519531 655.75 162.917969 646.09375 161.796875 L 626.351562 250.734375 C 625.933594 252.601562 625.28125 254.378906 624.789062 256.203125 L 654.21875 259.808594 C 700.136719 265.582031 746.71875 257.609375 788.105469 236.921875 L 867.5 197.257812 L 867.5 189.480469 C 867.496094 159.867188 859.589844 130.800781 844.59375 105.273438 L 815.941406 123.175781 C 773.738281 149.578125 724.957031 163.578125 675.175781 163.589844 Z M 675.175781 163.589844 " style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" /><path d="M 213.65625 282.519531 C 192.261719 282.472656 171.257812 276.816406 152.726562 266.109375 L 160.730469 345.746094 C 163.453125 372.957031 186.351562 393.6875 213.707031 393.6875 C 241.054688 393.6875 263.960938 372.957031 266.6875 345.746094 L 274.640625 266.128906 C 256.085938 276.832031 235.074219 282.480469 213.65625 282.519531 Z M 213.65625 282.519531 " style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" /><path d="M 80.425781 424.832031 L 71.574219 424.832031 C 57.867188 424.796875 44.890625 431.027344 36.355469 441.75 L 9.894531 474.753906 C 1.5625 485.148438 -1.746094 498.703125 0.882812 511.757812 L 2.707031 520.835938 C 6.445312 539.167969 21.058594 553.316406 39.503906 556.472656 L 48.847656 558.023438 C 80.957031 563.394531 106.117188 588.558594 111.492188 620.671875 C 113.878906 634.859375 122.929688 647.035156 135.820312 653.40625 L 135.820312 614.929688 C 135.820312 547.578125 116.605469 481.632812 80.425781 424.832031 Z M 80.425781 424.832031 " style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" /></g></svg>',
    columns: ["roots", "pulses", "spices", "others"]
}
// missing : beverages, because more drink than food

const cats = [cat1, cat2, cat3, cat4]

const text_before = "The food industry is a major actor in world's CO2 emissions and thus also responsible for global warming. The next \
question we want then to answer is who and why. To answer that we want to focus on people's diet. We collected data on each country \
habits of consumming. This shows, on average, how the country's habitants eat. We saw that each product doesn't emits the same amount of CO2,\
so depending on how they eat, the country will have its CO2 emissions impacted.\
In order to have a first impression on a chosen country habit of consumption, we show how much ressource of the Earth global population would need\
if every one on the planet was consuming as an average person of that country.";

const text_animation = "This division shows how people eat in a specific country.<br> The diet is here divided in four main categories. \
Hovering on a category will show what percentage of their diet is composed of that category and you will also have the details of what \
is contained inside that category."

/********************************/

// variables for code
let data_consumption, data_intake;
let lands_available;
let color;

let country;
let svg_world, svg_country;

const defaultArea = 100000;
let area_country;

const margin_chart_land = 20;
const height_division_land = 600;

function land(if_everyone, intake) {

    // get formatted data
    const data_land = get_data_land(if_everyone, intake);
    data_consumption = data_land.consumption;
    data_intake = data_land.intake;

    // Make a list of the countries that are in the 4 datasets
    lands_available = make_list_land(data_consumption, data_intake);
    lands_available.push("World")

    // create color function
    color = d3.scaleOrdinal(d3.schemePaired).range(['#ffffff', '#992437']); // TO DEFINE
    // update color domain
    land_color_domain(color, lands_available);

    // default display is Canada
    country = "Canada";
    // get areas
    area_country = getAreaCountry(defaultArea, data_consumption, country);
    // append (so first = true) and display the 2 charts
    svg_world = init_division_world(defaultArea, color, true);
    svg_country = init_division_country(area_country, color, true, country);

    // Autocomplete for the search bar
    new autoComplete({
        selector: "#search-bar input",
        minChars: 1,
        source: function (term, suggest) {
            term = term.toLowerCase();
            var matches = [];
            lands_available.forEach(function (d) {
                if (~d.toLowerCase().indexOf(term)) {
                    matches.push(d);
                }
            });
            suggest(matches);
        },
        renderItem: function (item, search) {
            search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
            return '<div class="autocomplete-suggestion" data-val="'
                + item + '">' + item.replace(re, "<b>$1</b>") + "</div>";
        },
        onSelect: function (e, term, item) {
            country = term;
            area_country = getAreaCountry(defaultArea, data_consumption, country);
            init_division_country(area_country, color, false, country, svg_country);
            init_division_world(defaultArea, color, false, svg_world);
            reset();
        }
    });
}


/**
 * Create JS objects containing the data needed for the viz
 *
 * @param if_everyone       Data about how much Earth's would we need if everyone what consumming like a specific country
 * @param intake            Intake (kg/capita/year) for different types of food per country
 */
function get_data_land(if_everyone, intake) {

    var data_consumption = if_everyone.map(d => {
        return {
            key: d.Entity,
            Percentage: d.Percentage
        }
    })

    var getData = (key, data) => {
        var find = data.find(d => d.Item == key)
        return find ? find.Value : 0
    }

    var data_intake = d3.nest()
        .key(d => d.Area)
        .rollup(a => {
            return {
                cereals: {
                    details: cereals,
                    value: d3.sum(cereals.map(d => getData(d, a)))
                },
                roots: {
                    details: roots,
                    value: d3.sum(roots.map(d => getData(d, a)))
                },
                sweeteners: {
                    details: sweeteners,
                    value: d3.sum(sweeteners.map(d => getData(d, a)))
                },
                pulses: {
                    details: pulses,
                    value: d3.sum(pulses.map(d => getData(d, a)))
                },
                oilcrops: {
                    details: oilcrops,
                    value: d3.sum(oilcrops.map(d => getData(d, a)))
                },
                oils: {
                    details: oils,
                    value: d3.sum(oils.map(d => getData(d, a)))
                },
                vegetables: {
                    details: vegetables,
                    value: d3.sum(vegetables.map(d => getData(d, a)))
                },
                fruits: {
                    details: fruits,
                    value: d3.sum(fruits.map(d => getData(d, a)))
                },
                spices: {
                    details: spices,
                    value: d3.sum(spices.map(d => getData(d, a)))
                },
                beverages: {
                    details: beverages,
                    value: d3.sum(beverages.map(d => getData(d, a)))
                },
                meat: {
                    details: meat,
                    value: d3.sum(meat.map(d => getData(d, a)))
                },
                fish: {
                    details: fish,
                    value: d3.sum(fish.map(d => getData(d, a)))
                },
                others: {
                    details: others,
                    value: d3.sum(others.map(d => getData(d, a)))
                }
            }
        })
        .entries(intake)
    return {
        consumption: data_consumption,
        intake: data_intake
    }
}

/**
 * Make a list of all the countries having data in the four datasets
 *
 * @param data_consumption       Data about how much Earth's would we need if everyone what consumming like a specific country
 * @param data_intake            Intake (kg/capita/year) for different types of food per country
 */
function make_list_land(data_consumption, data_intake) {
    var sets = [data_consumption, data_intake];
    var min_length = d3.min(sets.map(d => d.length));
    var short_set = sets.filter(d => d.length == min_length)[0];

    var list = [];
    short_set.forEach(element => {
        var name = element.key;
        var presence = true;
        sets.forEach(set => {
            if (set.find(d => d.key == name) === undefined)
                presence = false;
        })
        if (presence)
            list.push(name)
    });
    return list;
}

function land_color_domain(color, data) {
    color.domain(data)
}

function getAreaCountry(defaultArea, data_consumption, country) {
    var element = data_consumption.find(d => d.key == country);
    var scale = element.Percentage / 100;
    // update text display
    d3.select("#country").text(country);
    d3.select("#value").text(scale.toFixed(2));
    return defaultArea * scale;
}


/**
 * Displays 4 rects elements forming a big rectangle to show the surface of the world
 *
 * @param init_area         Area value of the world coming from getAreaWorld
 * @param color             Color function
 * @param first             Notifies if we have to add the svg, or if it is just an update
 * @param svg               Svg containing the squares. Will only be specified when first = false
 */
function init_division_world(init_area, color, first, svg) {

    // append the svg if it is the first time that the function is called
    if (first) {
        svg = d3.select("#land #rightDivision")
            .append('svg')
            .attr('height', height_division_land);
    }

    var size = Math.sqrt(init_area * 25 / 100)
    var data = [size, size, size, size]
    var rects = first ?
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect') :
        svg.selectAll('rect')
            .on('mouseover', _ => { })
            .data(data)
            .transition()
            .duration(500);
    rects.attr('width', size)
        .attr('height', size)
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('transform', (d, i) => {
            var left,
                top;
            switch (i) {
                case 0:
                    left = - size;
                    top = - size;
                    break;
                case 1:
                    left = 0;
                    top = - size;
                    break;
                case 2:
                    left = 0;
                    top = 0;
                    break;
                case 3:
                    left = - size;
                    top = 0;
                    break;
            }
            return `translate(${left},${top})`;
        })
        // .attr('fill', color("World"));
        .attr('fill', 'var(--color-light2)');

    svg.selectAll('text')
        .remove()

    return svg;
}

/**
 * Displays 4 rects elements forming a big rectangle to show the surface of the world
 *
 * @param init_area         Area value of the world coming from getAreaWorld
 * @param color             Color function
 * @param first             Notifies if we have to add the svg, or if it is just an update
 * @param country           Name of the country
 * @param svg               Svg containing the squares. Will only be specified when first = false
 */
function init_division_country(init_area, color, first, country, svg) {

    // append the svg if it is the first time that the function is called
    if (first) {
        svg = d3.select("#land #leftDivision")
            .append('svg')
            .attr('height', height_division_land);
    }

    var size = Math.sqrt(init_area * 25 / 100)
    var data = [size, size, size, size]
    var rects = first ?
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect') :
        svg.selectAll('rect')
            .on('mouseover', _ => { })
            .data(data)
            .transition()
            .duration(500);
    rects.attr('width', size)
        .attr('height', size)
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('transform', (d, i) => {
            var left,
                top;
            switch (i) {
                case 0:
                    left = - size;
                    top = - size;
                    break;
                case 1:
                    left = 0;
                    top = - size;
                    break;
                case 2:
                    left = 0;
                    top = 0;
                    break;
                case 3:
                    left = - size;
                    top = 0;
                    break;
            }
            return `translate(${left},${top})`;
        })
        // .attr('fill', color(country));
        .attr('fill', 'var(--color-dark3)');

    svg.selectAll('text')
        .remove()

    svg.selectAll('image')
        .remove()

    return svg;
}


/**
 * Displays 4 rects elements forming a big rectangle to show the surface of a country
 *
 * @param svg               Svg containing the squares.
 * @param data_intake       Intake (kg/capita/year) for different types of food per country 
 * @param init_area         Area value of the world coming from getAreaCountry
 */
function chart_division_world(svg, data_intake, init_area) {

    var mean_data = {
        cereals: { details: cereals, value: d3.mean(data_intake.map(d => d.value.cereals.value)) },
        roots: { details: roots, value: d3.mean(data_intake.map(d => d.value.roots.value)) },
        sweeteners: { details: sweeteners, value: d3.mean(data_intake.map(d => d.value.sweeteners.value)) },
        pulses: { details: pulses, value: d3.mean(data_intake.map(d => d.value.pulses.value)) },
        oilcrops: { details: oilcrops, value: d3.mean(data_intake.map(d => d.value.oilcrops.value)) },
        oils: { details: oils, value: d3.mean(data_intake.map(d => d.value.oils.value)) },
        vegetables: { details: vegetables, value: d3.mean(data_intake.map(d => d.value.vegetables.value)) },
        fruits: { details: fruits, value: d3.mean(data_intake.map(d => d.value.fruits.value)) },
        spices: { details: spices, value: d3.mean(data_intake.map(d => d.value.spices.value)) },
        beverages: { details: beverages, value: d3.mean(data_intake.map(d => d.value.beverages.value)) },
        meat: { details: meat, value: d3.mean(data_intake.map(d => d.value.meat.value)) },
        fish: { details: fish, value: d3.mean(data_intake.map(d => d.value.fish.value)) },
        others: { details: others, value: d3.mean(data_intake.map(d => d.value.others.value)) }
    }

    var categories = [{}, {}, {}, {}];

    var s = 0;
    // get the sum of the values of each category
    cats.forEach((cat, i) => {
        var value = d3.sum(cat.columns.map(d => mean_data[d].value));
        var all_cat = cat.columns.map(d => mean_data[d].details)
        all_cat = [].concat.apply([], all_cat);
        categories[i].value = value;
        categories[i].details = all_cat;

        s += value;
    })
    // get the value as percentage
    categories.forEach(cat => {
        cat.value = cat.value / s;
    })

    // add rects
    svg.selectAll('rect')
        .on('mouseover', (d, i) => {
            var value = categories[i].value;
            var details = categories[i].details;
            var columns = cats[i].columns;
            display_columns(value, details, columns, "World")
        })
        .data(categories)
        .transition()
        .duration(500)
        .attr('width', d => Math.sqrt(init_area * d.value))
        .attr('height', d => Math.sqrt(init_area * d.value))
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('transform', (d, i) => {
            var left,
                top,
                area = init_area * d.value;
            var size = Math.sqrt(area)
            switch (i) {
                case 0:
                    left = - (size + margin_chart_land);
                    top = - (size + margin_chart_land);
                    break;
                case 1:
                    left = margin_chart_land;
                    top = - (size + margin_chart_land);
                    break;
                case 2:
                    left = margin_chart_land;
                    top = margin_chart_land;
                    break;
                case 3:
                    left = - (margin_chart_land + size);
                    top = margin_chart_land;
                    break;
            }
            return `translate(${left},${top})`;
        });


    // add icons
    var icon_sizes = [];
    svg.selectAll('svg.icon')
        .data(categories)
        .enter()
        .append('svg:image')
        .classed('icon', true)
        .classed('anchor_middle', true)
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('transform', (d, i) => {
            var left,
                top,
                area = init_area * d.value;
            var size = Math.sqrt(area);
            var icon_size = size / 3 + 10;
            // var vert_align = d.value * 20;
            switch (i) {
                case 0:
                    left = - (size / 2 + margin_chart_land + icon_size / 2);
                    top = - (size / 2 + margin_chart_land + icon_size / 2);
                    break;
                case 1:
                    left = size / 2 + margin_chart_land - icon_size / 2;
                    top = - (size / 2 + margin_chart_land + icon_size / 2);
                    break;
                case 2:
                    left = size / 2 + margin_chart_land - icon_size / 2;
                    top = size / 2 + margin_chart_land - icon_size / 2;
                    break;
                case 3:
                    left = - (size / 2 + margin_chart_land + icon_size / 2);
                    top = size / 2 + margin_chart_land - icon_size / 2;
                    break;
            }
            icon_sizes.push(icon_size)
            return `translate(${left},${top})`;
        })
        // .style("font-size", d => 20 + d.value * 80)
        // .text(d => (d.value * 100).toFixed(2))
        .attr('width', (d, i) => icon_sizes[i])
        .attr('height', (d, i) => icon_sizes[i])
        .attr('xlink:href', (d, i) => 'img/' + cats[i].img + '_dark.svg')
        .attr('opacity', 0)
        .transition()
        .duration(400)
        .delay(300)
        .attr('opacity', 1)

    // add titles
    // svg.selectAll('text')
    //     .data(cats)
    //     .enter()
    //     .append('text')
    //     .attr('x', '50%')
    //     .attr('y', '50%')
    //     .classed('anchor_left', (d, i) => i == 0 || i == 3)
    //     .attr('transform', (d, i) => {
    //         var left, top;
    //         switch (i) {
    //             case 0:
    //                 left = - 2 * margin_chart_land;
    //                 top = - 2 * margin_chart_land;
    //                 break;
    //             case 1:
    //                 left = 2 * margin_chart_land;
    //                 top = - 2 * margin_chart_land;
    //                 break;
    //             case 2:
    //                 left = 2 * margin_chart_land;
    //                 top = 3 * margin_chart_land;
    //                 break;
    //             case 3:
    //                 left = - 2 * margin_chart_land;
    //                 top = 3 * margin_chart_land;
    //                 break;
    //         }
    //         return `translate(${left},${top})`;
    //     })
    //     .style("font-size", (d, i) => 10 + categories[i].value * 40)
    //     .text(d => d.name);
}


/**
 * Tranisition into display of 4 squares representing the proportion of land used for different types of element
 *
 * @param svg               Svg containing the squares.
 * @param data_intake       Intake (kg/capita/year) for different types of food per country 
 * @param init_area         Area value of the world coming from getAreaWorld
 * @param country           Name of the country
 * @param color             Color function
 */
function chart_division_country(svg, data_intake, init_area, country, color) {

    var element = data_intake.find(d => d.key == country);

    var categories = [{}, {}, {}, {}];

    var s = 0;
    // get the sum of the values of each category
    cats.forEach((cat, i) => {
        var value = d3.sum(cat.columns.map(d => element.value[d].value));
        var all_cat = cat.columns.map(d => element.value[d].details)
        all_cat = [].concat.apply([], all_cat);
        categories[i].value = value;
        categories[i].details = all_cat;

        s += value;
    })
    // get the value as percentage
    categories.forEach(cat => {
        cat.value = cat.value / s;
    })

    // add rects
    svg.selectAll('rect')
        .on('mouseover', (d, i) => {
            var value = categories[i].value;
            var details = categories[i].details;
            var columns = cats[i].columns;
            display_columns(value, details, columns, country)
        })
        .data(categories)
        .transition()
        .duration(500)
        .attr('width', d => Math.sqrt(init_area * d.value))
        .attr('height', d => Math.sqrt(init_area * d.value))
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('transform', (d, i) => {
            var left,
                top,
                area = init_area * d.value;
            var size = Math.sqrt(area)
            switch (i) {
                case 0:
                    left = - (size + margin_chart_land);
                    top = - (size + margin_chart_land);
                    break;
                case 1:
                    left = margin_chart_land;
                    top = - (size + margin_chart_land);
                    break;
                case 2:
                    left = margin_chart_land;
                    top = margin_chart_land;
                    break;
                case 3:
                    left = - (margin_chart_land + size);
                    top = margin_chart_land;
                    break;
            }
            return `translate(${left},${top})`;
        })
    // .attr('fill', color(country));

    // add icons
    var icon_sizes = [];
    svg.selectAll('svg.icon')
        .data(categories)
        .enter()
        .append('svg:image')
        .classed('icon', true)
        .classed('anchor_middle', true)
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('transform', (d, i) => {
            var left,
                top,
                area = init_area * d.value;
            var size = Math.sqrt(area);
            var icon_size = size / 3 + 10;
            // var vert_align = d.value * 20;
            switch (i) {
                case 0:
                    left = - (size / 2 + margin_chart_land + icon_size / 2);
                    top = - (size / 2 + margin_chart_land + icon_size / 2);
                    break;
                case 1:
                    left = size / 2 + margin_chart_land - icon_size / 2;
                    top = - (size / 2 + margin_chart_land + icon_size / 2);
                    break;
                case 2:
                    left = size / 2 + margin_chart_land - icon_size / 2;
                    top = size / 2 + margin_chart_land - icon_size / 2;
                    break;
                case 3:
                    left = - (size / 2 + margin_chart_land + icon_size / 2);
                    top = size / 2 + margin_chart_land - icon_size / 2;
                    break;
            }
            icon_sizes.push(icon_size)
            return `translate(${left},${top})`;
        })
        // .style("font-size", d => 20 + d.value * 80)
        // .text(d => (d.value * 100).toFixed(2))
        .attr('width', (d, i) => icon_sizes[i])
        .attr('height', (d, i) => icon_sizes[i])
        .attr('xlink:href', (d, i) => 'img/' + cats[i].img + '_light.svg')
        .attr('opacity', 0)
        .transition()
        .duration(400)
        .delay(300)
        .attr('opacity', 1)


    // add titles
    // svg.selectAll('text.titles')
    //     .data(cats)
    //     .enter()
    //     .append('text')
    //     .attr('x', '50%')
    //     .attr('y', '50%')
    //     .classed('titles', true)
    //     .classed('anchor_middle', true)
    //     // .classed('anchor_left', (d, i) => i == 0 || i == 3)
    //     .attr('transform', (d, i) => {
    //         var left, top;
    //         var size = Math.sqrt(init_area * categories[i].value);
    //         switch (i) {
    //             case 0:
    //                 left = - size / 2 - margin_chart_land;
    //                 top = -2 * margin_chart_land;
    //                 break;
    //             case 1:
    //                 left = size / 2 + margin_chart_land;
    //                 top = -2 * margin_chart_land;
    //                 break;
    //             case 2:
    //                 left = size / 2 + margin_chart_land;
    //                 top = size;
    //                 break;
    //             case 3:
    //                 left = - size / 2 - margin_chart_land;
    //                 top = size;
    //                 break;
    //         }
    //         return `translate(${left},${top})`;
    //     })
    //     .style("font-size", (d, i) => 10 + categories[i].value * 40)
    //     .text(d => d.name);
}


// display the percentages and what is composed the hovered area
function display_columns(value, details, columns, country) {
    var g = d3.select("#div_columns");

    g.select("#columns_country").text(country);
    var perc = value * 100;
    g.select("#columns_percentage").text(perc.toFixed(2));
    var html = "";
    columns.forEach(d => {
        html += d + "<br>"
    })
    g.select("#columns").html(html);
    g.classed("display", true)

    display_details(details)
}

// display everything that is composing a category
function display_details(array) {
    var html = "Detailed composition of the category : <br><br>"
    html += "|"
    array.forEach(d => {
        html += "| " + d + " |"
    })
    html += "|"
    d3.select("#details").html(html)
}

// empties the details div and undisplays the text that is between the charts
function reset() {
    d3.select("#details").html('');
    d3.select("#div_columns").classed("display", false);
}


/********************* SCROLL ****************/

var transition_completed = false;
var scroll_trigger = 550;
function land_scroll(position) {
    if (position < scroll_trigger && transition_completed) {
        init_division_world(defaultArea, color, false, svg_world);
        init_division_country(area_country, color, false, country, svg_country);
        reset();
        transition_completed = false;
    }
    if (position > scroll_trigger && !transition_completed) {
        d3.select("#details").html(text_animation);
        chart_division_world(svg_world, data_intake, defaultArea);
        chart_division_country(svg_country, data_intake, defaultArea, country, color);
        transition_completed = true;
    }
}