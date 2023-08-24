const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clrbtn = document.getElementById("clear");
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
isEditMode = false;

function displayItems(){
const itemsFromStorage = getItemsFromStorage();
itemsFromStorage.forEach((item)=>addItemToDOM(item));
resetui();
}

function onAddItemSubmit(e){
    e.preventDefault();
    const newItem = itemInput.value;

    if(newItem === ""){
        alert("please add an item")
        return;
    }

    if(isEditMode){
        const itemToEdit = itemList.querySelector(".edit-mode");
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove("edit-mode");
        itemToEdit.remove();
        isEditMode=false;
    }else{
        if(checkIfItemExists(newItem)){
            alert("That Item already exists!");
            return;
        }
    }
    addItemToDOM(newItem);
    addItemToStorage(newItem);
    resetui();
    itemInput.value="";

}
function addItemToDOM(item){
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item));
    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button);
    
    
    itemList.appendChild(li);
}
function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage();
    
    itemsFromStorage.push(item);
    localStorage.setItem("items",JSON.stringify(itemsFromStorage))
}
function getItemsFromStorage(){
    let itemsFromStorage;
    if(localStorage.getItem("items") === null){
        itemsFromStorage=[];
    }
    else{
        itemsFromStorage=JSON.parse(localStorage.getItem("items"));
    }
    return itemsFromStorage;
}
function createButton(classes){
    const button = document.createElement("button");
    button.className=classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon)
    return button;
}
function createIcon(classes){
    const icon = document.createElement("i");
    icon.className=classes;
    return icon;
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains("remove-item")){
        removeItem(e.target.parentElement.parentElement);
    }else{
        setItemToEdit(e.target);

    }
}

function setItemToEdit(item){
    isEditMode= true;
    itemList
    .querySelectorAll("li")
    .forEach((i)=>i.classList.remove("edit-mode"));
    item.classList.add("edit-mode");
    formBtn.innerHTML="<i class='fa-solid fa-pen'></i>   Update Item";
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}
function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function removeItem(item){
    if(confirm("are you sure?")){
        item.remove();
    }
    removeItemFromStorage(item.textContent);
    
    resetui();
}

function removeItemFromStorage(text){
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage = itemsFromStorage.filter((i)=>i !== text);
    localStorage.setItem("items",JSON.stringify(itemsFromStorage));

}

function clearall(e){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    
    }
    localStorage.removeItem("items");
    resetui();
}
function resetui(){
    const items = itemList.querySelectorAll("li");
    if (items.length===0){
        clrbtn.style.display="none";
        itemFilter.style.display="none";
    }
    else{
        clrbtn.style.display="block";
        itemFilter.style.display="block";
    }
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}
function filterItems(e){
    const items = itemList.querySelectorAll("li");
    const text = e.target.value.toLowerCase();
    items.forEach((item)=>{
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(text)!= -1){
            item.style.display= "flex";
        }else{
            item.style.display="none";
        }
    });


}


itemForm.addEventListener("submit",onAddItemSubmit);
itemList.addEventListener("click",onClickItem);
clrbtn.addEventListener("click",clearall);
itemFilter.addEventListener("input",filterItems);
document.addEventListener('DOMContentLoaded', displayItems);
resetui();