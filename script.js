let fileName = "Document";
let totalPages = 1;
let currentPageNumber = 1;
let styledBlockIdCounter = 1;

const bodybg = getComputedStyle(document.body);
const BGcolorPicker = document.getElementById("bg-color-picker");
BGcolorPicker.addEventListener("input", () => {
	const selectedColor = BGcolorPicker.value;
	if (selectedColor) {
		document.body.style.backgroundColor = selectedColor;
		const brightness = calculateBrightness(selectedColor);
		const textColor = brightness < 128 ? "white" : "black";
		document.body.style.color = textColor;
		updateStyleDisplay();
	}
});

function calculateBrightness(color) {
	// Convert hex color to RGB
	const r = parseInt(color.substring(1, 3), 16);
	const g = parseInt(color.substring(3, 5), 16);
	const b = parseInt(color.substring(5, 7), 16);
	
	// Calculate brightness using the formula
	return (r * 299 + g * 587 + b * 114) / 1000;
}

const affectedArea = document.getElementById("pages");
const alignmentSelect = document.getElementById("alignment-select");
let selectedBlock = null;
affectedArea.addEventListener("click", (event) => {
	const block = event.target.closest(".styled-block");
	if (block) {
		if (selectedBlock === block) {
			deselectBlock();
		} else {
			if (selectedBlock) {
				selectedBlock.classList.remove("selected");
			}
			block.classList.add("selected");
			selectedBlock = block;
			updateBlockOptions();
		}
	}
});
function deselectBlock() {
	selectedBlock.classList.remove("selected");
	selectedBlock = null;
	textInput.value = "<p></p>";
	alignmentSelect.value = "left";
	saveBtn.disabled = true;
	deleteBtn.disabled = true;
	upBtn.disabled = true;
	downBtn.disabled = true;
}
function updateBlockOptions() {
	textInput.value = selectedBlock.innerHTML;
	alignmentSelect.value = getComputedStyle(selectedBlock).textAlign;
	saveBtn.disabled = false;
	deleteBtn.disabled = false;
	upBtn.disabled = false;
	downBtn.disabled = false;
}

const editor = document.getElementById("editor");

const textInput = document.getElementById("text-input");
textInput.value = "<p></p>";
const submitBtn = document.getElementById("submit-btn");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");
const upBtn = document.getElementById("up-btn");
const downBtn = document.getElementById("down-btn");

submitBtn.addEventListener("click", () => {
	const styledText = textInput.value;
	let wrappedText = styledText;
	//this was for existing styled-blocks to be imported, a different method is probably needed based on styled-block ids
	if (wrappedText.trim().startsWith("<div class=\"page\"")) {
		affectedArea.insertAdjacentHTML("beforeend", wrappedText);
		deleteEmptyPages();
	} else {
		createStyledBlock(wrappedText);
	}
	updateStyleDisplay();
	textInput.value = "<p></p>";
	saveBtn.disabled = true;
});

function deleteEmptyPages() {
	console.log(`run deleteEmptyPages`);
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (!page.querySelector('div')) {
            page.remove();
			console.log(`page removed`);
        }
    });
}

saveBtn.addEventListener("click", () => {
	const tag = document.getElementById("p-text-style").value;
	let newText = textInput.value.trim();

	// Check if newText starts with a heading tag
	if (newText.startsWith("<h") && newText.indexOf(">") !== -1) {
		// Extract the existing tag
		const existingTag = newText.substring(0, newText.indexOf(">") + 1);
		// Replace the existing tag with the selected tag if it's not "default"
		if (tag !== "default") {
			newText = `<${tag}>${newText.substring(newText.indexOf(">") + 1)}</${tag}>`;
		} else {
			// Remove the existing tag
			newText = newText.substring(newText.indexOf(">") + 1);
			newText = newText.substring(0, newText.lastIndexOf("</h") );
		}
	} else {
		// Wrap newText with the selected tag if it's not "default"
		if (tag !== "default") {
			newText = `<${tag}>${newText}</${tag}>`;
		}
	}

	if (selectedBlock) {
		selectedBlock.innerHTML = newText;
		selectedBlock.style.textAlign = alignmentSelect.value;
		
		allBreechCheck();
		getFileName();
		updateStyleDisplay();
		deselectBlock();
	}
});
deleteBtn.addEventListener("click", () => {
	if (selectedBlock) {
		selectedBlock.remove();
		updateStyleDisplay();
		deselectBlock();
	}
});

upBtn.addEventListener("click", () => {
	console.log(`moving block up`);
    if (selectedBlock) {
        const tempId = selectedBlock.id;
        const prev = selectedBlock.previousElementSibling;
        if (prev) {
            selectedBlock.id = prev.id;
            prev.id = tempId;
			console.log(`switched w prev id`);
        } else {
            const parentPrev = selectedBlock.parentElement.previousElementSibling;
            if (parentPrev) {
                const lastStyledBlock = parentPrev.querySelectorAll(".styled-block");
				let lastId = lastStyledBlock[lastStyledBlock.length - 1];
				splitIds(lastId);
				targetOrderId++;
				lastId = `${parentId}O${String(targetOrderId).padStart(3, '0')}`
				selectedBlock.id = lastId;
				moveBlocks2Parents();
				page2check = document.getElementById(parentId);
				breechCheck(page2check);
				console.log(`block moved to prev parent`);
				if (selectedBlock.id != lastId) {
					lastId = lastStyledBlock[lastStyledBlock.length - 1].id;
					selectedBlock.id = lastId;
					lastStyledBlock[lastStyledBlock.length - 1].id = tempId;
					moveBlocks2Parents();
					console.log(`block id -1 and moved to prev parent.. or something?`);
				} else {
					targetPageId++;
					if (targetPageId === 0) {
					  targetPageId = 1;
					}
					let targetPage = `P${String(targetPageId).padStart(5, '0')}`;
					resetStyledBlockIds(targetPage);
					console.log(`block moved to prev parent with no id adjustment`);
				}
            }
        }
        orderBlocks();
		console.log(`ran orderBlocks`);
		allBreechCheck();
		console.log(`ran allBreechCheck`);
        updateStyleDisplay();
    }
});


downBtn.addEventListener("click", () => {
    if (selectedBlock) {
        const next = selectedBlock.nextElementSibling;
        if (next) {
            const tempId = selectedBlock.id;
            selectedBlock.id = next.id;
            next.id = tempId;
        }
		else {
			//try less robust method
			/* splitIds(selectedBlock);
			const adjustedId = targetPageId - 1; //This is needed in this situation... brain too tired to know why.
			if (moveBlock2NextPage(adjustedId, selectedBlock)) {
				orderBlocks(); */
			const parentNext = selectedBlock.parentElement.nextElementSibling;
            if (parentNext) {
                const parentFirstChild = parentNext.firstElementChild;
                const tempId = selectedBlock.id;
                selectedBlock.id = parentFirstChild.id;
                parentFirstChild.id = tempId;
				moveBlocks2Parents();
            }
        }
        orderBlocks();
		allBreechCheck();
        updateStyleDisplay();
	}
});


let targetOrderId = 0;
let targetPageId = 0;
let parentId = null;
let orderId = null;
let parentOrderId= null;

function splitIds(block) {
	targetOrderId = parseInt(block.id.substr(-3));
	targetPageId = parseInt(block.id.slice(1, 6));
	parentId = `P${String(targetPageId).padStart(5, '0')}`;
	orderId = `O${String(targetOrderId).padStart(3, '0')}`;
	parentOrderId= `${parentId}${orderId}`;
	console.log(`run splitIds, targetOrderId=${targetOrderId}, targetPageId=${targetPageId}, parentId=${parentId}, orderId=${orderId}, parentOrderId=${parentOrderId}`);
}

function createStyledBlock(styledText) {
	console.log(`run createStyledBlock`);
    let styledBlockId;

    if (selectedBlock) {
        splitIds(selectedBlock);
		const newIdNumber = targetOrderId + 1;
        styledBlockId = `${parentId}O${String(newIdNumber).padStart(3, '0')}`;
		renumberStyledBlocks(parentId, styledBlockId);
    } else {
        const pageCount = document.querySelectorAll('.page').length;
        const paddedPageCount = String(pageCount).padStart(5, '0');
        parentId = `P${paddedPageCount}`;
        const parentElement = document.getElementById(parentId);
        if (!parentElement) {
            console.error(`Parent element with id '${parentId}' not found.`);
            return;
        }
        const styledBlockCount = parentElement.querySelectorAll('.styled-block').length;
		console.log(styledBlockCount);
        const paddedStyledBlockCount = String(styledBlockCount + 1).padStart(3, '0');
        styledBlockId = `${parentId}O${paddedStyledBlockCount}`;
    }
	// update id if importing styled-block
	let styledBlock;
	if (styledText.trim().startsWith("<div class=\"styled-block")) {
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = styledText.trim();
		tempDiv.firstChild.id = styledBlockId;
		styledBlock = tempDiv.firstChild.outerHTML;
		tempDiv.remove();
	} else {
		styledBlock = `<div class="styled-block" id="${styledBlockId}">${styledText}</div>`;
	}
	console.log(`styledBlockId is ${styledBlockId}`);
    insertStyledBlock(styledBlock, parentId);
}

function insertStyledBlock(styledBlock, parentId) {
	console.log(`Run instertStyledBlock`);
    const parentElement = document.getElementById(parentId);
    if (!parentElement) {
        console.error(`Parent element with id '${parentId}' not found.`);
        return;
    }
    parentElement.insertAdjacentHTML('beforeend', styledBlock);
    
	
	orderBlocks();// order first, otherwise breechcheck will rename stuff
	allBreechCheck();
	updateStyleDisplay();
}

function moveBlocks2Parents() {
    const styledBlocks = document.querySelectorAll('.styled-block');
    styledBlocks.forEach(styledBlock => {
        const parentId = styledBlock.id.slice(0, 6); // Get the first 6 characters of the styled block's ID
        const parent = document.getElementById(parentId);
        if (parent) {
            parent.appendChild(styledBlock); // Move the styled block to its intended parent
        }
    });
}

function orderBlocks() {
	console.log(`run orderBlocks`);
    const pageElements = document.querySelectorAll('.page');
    pageElements.forEach(page => {
        const styledBlockElements = Array.from(page.querySelectorAll('.styled-block'));
        styledBlockElements.sort((a, b) => {
            const idA = parseInt(a.id.slice(-3));
            const idB = parseInt(b.id.slice(-3));
            return idA - idB;
        });
        styledBlockElements.forEach((styledBlock, index) => {
            page.appendChild(styledBlock); // Move the element to the end of the parent
        });
    });
}

function resetStyledBlockIds(parentId) {
	console.log(`resetting block ids for ${parentId}`);
    const parentElement = document.getElementById(parentId);
    if (!parentElement) {
        console.log('no parent found');
        return;
    }
    for (let i = 0; i < parentElement.children.length; i++) {
        const newIdNumber = i + 1;
        const newId = `${parentId}O${String(newIdNumber).padStart(3, '0')}`;
        parentElement.children[i].id = newId;
    }
}

function renumberStyledBlocks(parentId, startId) {
    const parentElement = document.getElementById(parentId);
    if (!parentElement) {
		console.log('no parent found');
		return;
	}
    // Find the index of the starting ID
    const startIndex = Array.from(parentElement.children).findIndex(child => child.id === startId);
    if (startIndex === -1) {
		console.log('start index not found');
		return;
	}
    for (let i = startIndex; i < parentElement.children.length; i++) {
        const block = parentElement.children[i];
        const lastThreeDigits = parseInt(block.id.substr(-3));
        const newIdNumber = lastThreeDigits + 1;
        block.id = `${parentId}O${String(newIdNumber).padStart(3, '0')}`;
    }
}

function calculateBlockHeight(block) {
    let blockHeight = 0;
    const lineHeightMap = {
        "h1": 0,
        "h2": 0,
        "h3": 0,
        "h4": 0
    };
    const paragraphs = block.querySelectorAll("p");
    const pLineHeight = parseInt(getComputedStyle(block).minHeight);
    const totalParagraphsHeight = paragraphs.length * pLineHeight;

    for (let tag in lineHeightMap) {
        const tags = block.querySelectorAll(tag);
        if (tags.length > 0) {
            lineHeightMap[tag] = parseInt(getComputedStyle(tags[0]).fontSize);
        }
    }

    for (let tag in lineHeightMap) {
        const totalTagHeight = lineHeightMap[tag] * block.querySelectorAll(tag).length;
        blockHeight += totalTagHeight;
    }

    blockHeight += totalParagraphsHeight;
    blockHeight += block.scrollHeight;

    return blockHeight;
}


function allBreechCheck() {
	console.log(`run allBreechCheck`);
    const existingPages = document.querySelectorAll(".page");
    existingPages.forEach(page2check => {
        breechCheck(page2check);
    });
	deleteEmptyPages();
}

function breechCheck(page2check) {
    let totalHeight = 0;
    let pageIdNum = parseInt(page2check.id.slice(1, 6));
    const styledBlocks = page2check.querySelectorAll(".styled-block");
    const movingBlock = styledBlocks[styledBlocks.length - 1];
	//console.log(`breechChecking ${page2check.id}, pageIdNum= ${pageIdNum}, movingBlock= ${movingBlock.id}`);  this log specifically causes errors sometimes???
    styledBlocks.forEach(block => {
        totalHeight += calculateBlockHeight(block);
    });

    const compareHeight = pageHeightpx - pagePadToppx - pagePadBottompx;
	console.log(`totalHeight: ${totalHeight} compareHeight: ${compareHeight}`);
    if (totalHeight > compareHeight) {
		//page breeched
        if (moveBlock2NextPage(pageIdNum, movingBlock)) {
            orderBlocks();
        } else {
            console.log(`new page needed`);
            totalPages++;
            generatePage();
            pageTraits();
            orderBlocks();
            moveBlock2NextPage(pageIdNum, movingBlock);
        }
    }
}

function moveBlock2NextPage(pageIdNum, movingBlock) {
    const existingPages = document.querySelectorAll(".page");
    const nextPageNumber = String(pageIdNum + 2).padStart(5, "0");
    const firstBlockId = `P${nextPageNumber}O001`;

    if (pageIdNum + 1 < existingPages.length) {
        const nextPage = existingPages[pageIdNum + 1];
        renumberStyledBlocks(nextPage.id, firstBlockId);
        movingBlock.id = `${nextPage.id}O001`;
        nextPage.appendChild(movingBlock);
        console.log(`Moved ${movingBlock.id} to ${nextPage.id}`);
        return true; // Return true if block was successfully moved
    } else if (pageIdNum + 1 === existingPages.length) {
        const nextPage = existingPages[pageIdNum];
        movingBlock.id = `${nextPage.id}O001`;
        nextPage.appendChild(movingBlock);
        console.log(`Moved ${movingBlock.id} to ${nextPage.id}`);
    } else {
        console.log(`No next page to move to.`);
        return false; // Return false if there is no next page
    }
}

const titlebars = document.querySelectorAll('.titlebar');
// Add click event listener to each title bar
titlebars.forEach(titlebar => {
	titlebar.addEventListener('click', () => {
		// Get the corresponding content div
		const contentId = titlebar.id.replace('titlebar-', '');
		const contentDiv = document.getElementById(contentId);

		// Toggle the display of the content div
		if (contentDiv.style.display === 'none') {
			contentDiv.style.display = 'block';
		} else {
			contentDiv.style.display = 'none';
		}
	});
});

const pageParent = document.getElementById("pages");
const pageWidthInput = document.getElementById("page-width");
const pageHeightInput = document.getElementById("page-height");
const pagePaddingTopInput = document.getElementById("page-padding-top");
const pagePaddingRightInput = document.getElementById("page-padding-right");
const pagePaddingBottomInput = document.getElementById("page-padding-bottom");
const pagePaddingLeftInput = document.getElementById("page-padding-left");
const pageColorPicker = document.getElementById("page-color-picker");
const pageTextColorPicker = document.getElementById("page-text-color-picker");

let bgColor = "rgba(50, 50, 50, 1)"
let pageWidth = 8.5; 
let pageHeight = 11; 
let pagePaddingTop = 0.25; 
let pagePaddingRight = 0.25; 
let pagePaddingBottom = 0.25; 
let pagePaddingLeft = 0.25; 
let pageBackgroundColor = "#ffffff"; 
let pageTextColor = "#000000";


pageWidthInput.value = pageWidth;
pageHeightInput.value = pageHeight;
pagePaddingTopInput.value = pagePaddingTop;
pagePaddingRightInput.value = pagePaddingRight;
pagePaddingBottomInput.value = pagePaddingBottom;
pagePaddingLeftInput.value = pagePaddingLeft;
pageColorPicker.value = pageBackgroundColor;
pageTextColorPicker.value = pageTextColor;

document.body.style.backgroundColor = bgColor;
pageParent.style.backgroundColor = pageBackgroundColor;
pageParent.style.color = pageTextColor;
pageParent.style.fontFamily = `Arial`;
pageParent.style.fontSize = `1em`;
pageParent.style.fontWeight = 100;
// move color pickers into pageTraits
pageColorPicker.addEventListener("input", () => {
	const selectedColor = pageColorPicker.value
	const existingPages = document.querySelectorAll(".page");
	if (selectedColor) {
		//existingPages.forEach(pagesplit => {	
		//	pagesplit.style.backgroundColor = selectedColor;})
		pageBackgroundColor = selectedColor;
		pageParent.style.backgroundColor = selectedColor;
		
	updateStyleDisplay();
	}
});
pageTextColorPicker.addEventListener("input", () => {
	const selectedColor = pageTextColorPicker.value;
	if (selectedColor) {
		pageTextColor = selectedColor; // Update the pageTextColor variable
		pageParent.style.color = pageTextColor; // Update the text color for .page
		updateStyleDisplay();
	}
});



const textRules = document.getElementById('text-rules');

// Function to update style property
function setStyleProperty(element, property, value) {
  element.style[property] = value;
  updateStyleDisplay();
}

// Event listener for text type change
document.getElementById('text-type').addEventListener('change', function() {
  const textType = this.value;
  ['font-family', 'font-size', 'font-weight', 'uline'].forEach(property => {
    const elements = textRules.querySelectorAll(`[id$="-${property}"]`);
    elements.forEach(element => {
      element.style.display = element.id === `${textType}-${property}` ? 'inline-block' : 'none';
    });
  });
});


const dfaltFontFamily = document.getElementById("default-font-family");
const dfaltFontSizeInput = document.getElementById("default-font-size");
const dfaltFontWeightInput = document.getElementById("default-font-weight");

let defaultFontSize = 1;
let defaultFontWeight = 100;

dfaltFontSizeInput.value = defaultFontSize;
dfaltFontWeightInput.value = defaultFontWeight;

// Reusable function to set style properties
function setStyleProperty(element, property, value) {
  element.style[property] = value;
  updateStyleDisplay();
}

// Event listener for all inputs
[dfaltFontFamily, dfaltFontSizeInput, dfaltFontWeightInput].forEach(input => {
  input.addEventListener("change", () => {
	if (input === dfaltFontFamily) {
	  setStyleProperty(pageParent, "fontFamily", input.value);
	} else if (input === dfaltFontSizeInput) {
	  setStyleProperty(pageParent, "fontSize", `${input.value}em`);
	} else if (input === dfaltFontWeightInput) {
	  setStyleProperty(pageParent, "fontWeight", input.value);
	}
  });
});


// Function to update styles
function updateFonts(tagName, fontFamilyId, fontSizeId, fontWeightId, defaultFontSize, defaultFontWeight) {
  const elements = document.getElementsByTagName(tagName);
  const fontFamily = document.getElementById(fontFamilyId);
  const fontSizeInput = document.getElementById(fontSizeId);
  const fontWeightInput = document.getElementById(fontWeightId);

  fontSizeInput.value = defaultFontSize;
  fontWeightInput.value = defaultFontWeight;

  fontFamily.addEventListener("change", () => {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.fontFamily = fontFamily.value;
    }
    updateStyleDisplay();
  });

  fontSizeInput.addEventListener("change", () => {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.fontSize = `${fontSizeInput.value}em`;
    }
    updateStyleDisplay();
  });

  fontWeightInput.addEventListener("change", () => {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.fontWeight = fontWeightInput.value;
    }
    updateStyleDisplay();
  });
}

// Update styles for different headings
updateFonts('h1', 'h1-font-family', 'h1-font-size', 'h1-font-weight', 2, 900);
updateFonts('h2', 'h2-font-family', 'h2-font-size', 'h2-font-weight', 1.5, 600);
updateFonts('h3', 'h3-font-family', 'h3-font-size', 'h3-font-weight', 1, 600);
updateFonts('h4', 'h4-font-family', 'h4-font-size', 'h4-font-weight', 0.75, 100);

// Event listener for underline checkboxes
document.querySelectorAll('#text-rules input[id$="-uline"]').forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    const tagName = checkbox.id.split('-')[0];
    const isdefault = tagName === 'default';

    const textDecoration = checkbox.checked ? 'underline' : 'none';
    if (isdefault) {
      pageParent.style.textDecoration = textDecoration;
    } else {
      document.querySelectorAll(tagName).forEach(heading => {
        heading.style.textDecoration = textDecoration;
      });
    }
    updateStyleDisplay();
  });
});

//
const blockColorPicker = document.getElementById("block-color-picker");
const blockTxtColorPicker = document.getElementById("block-text-color-picker");
let blockBackgroundColor = "#ffffff";
let blockTextColor = "#000000";

blockColorPicker.value = blockBackgroundColor;

//both block color pickers here:
const editOptions = document.getElementById("editoptions");
editOptions.addEventListener("input", function(event) {
  const target = event.target;
  if (target.matches("#block-color-picker, #block-text-color-picker")) {
    const selectedBlock = document.querySelector(".styled-block.selected");
    if (selectedBlock) {
      if (target.id === "block-color-picker") {
        selectedBlock.style.backgroundColor = target.value;
      } else if (target.id === "block-text-color-picker") {
        selectedBlock.style.color = target.value;
      }
      updateStyleDisplay();
    }
  }
});
	
function updateEditorWidth() {
	const totalPageWidth = pageWidthpx + pagePadLeftpx + pagePadRightpx;
	const editorWidth = `calc(100vw - ${totalPageWidth}px - 20px)`; // Subtract the total page width and padding from the viewport width
	editor.style.width = editorWidth;
}


let pageWidthpx = 0
let pageHeightpx = 0
let pagePadToppx = 0
let pagePadLeftpx = 0
let pagePadRightpx = 0
let pagePadBottompx = 0
	
function valu2px() {
	pageWidthpx = pageWidthInput.value * 100;
	pageHeightpx = pageHeightInput.value * 100;
	pagePadToppx = pagePaddingTopInput.value * 100;
	pagePadLeftpx = pagePaddingLeftInput.value * 100;
	pagePadRightpx = pagePaddingRightInput.value * 100;
	pagePadBottompx = pagePaddingBottomInput.value * 100;
}

function pageTraits() {
	valu2px();
	pageParent.style.width = `${pageWidthpx}px`;
	const existingPages = document.querySelectorAll(".page");
	existingPages.forEach(pagesplit => {		
		pagesplit.style.height = `${pageHeightpx}px`;
		pagesplit.style.borderTopWidth = `${pagePadToppx}px`;
		pagesplit.style.borderLeftWidth = `${pagePadLeftpx}px`;
		pagesplit.style.borderRightWidth = `${pagePadRightpx}px`;
		pagesplit.style.borderBottomWidth = `${pagePadBottompx}px`;
	});
	updateEditorWidth();
}

// Add event listeners to update styles
// Update page height when input values change
const pageOptions = document.getElementById("page-options");
pageOptions.addEventListener("input", function(event) {
	const target = event.target;
	if (target.matches("#page-width, #page-height, #page-padding-top, #page-padding-right, #page-padding-bottom, #page-padding-left, #page-color-picker, #page-text-color-picker")) {
		pageTraits();
	}
});

function generatePage() {
	console.log(`run generatePage`);
	const pagesDiv = document.getElementById("pages");
	const newPage = document.createElement("div");
	newPage.classList.add("page");
	let pageCount = document.querySelectorAll('.page').length;
	pageCount++;
    const paddedPageCount = String(pageCount).padStart(5, '0');
    newPage.id = `P${paddedPageCount}`;
	//newPage.id = `P${(totalPages).toString().padStart(5, '0')}`; totalPages is screwy and prolbably unnessecary
	pagesDiv.appendChild(newPage);
	console.log(`created ${paddedPageCount}`);
}

// Set the initial values for inputs---will need to check for existin styled-blocks and .pages here.

generatePage();
pageTraits();

function copyAll() {
	navigator.clipboard.writeText(styleDisplay.textContent);
	document.getElementById("copy-btn").textContent = "";
	setTimeout(() => {
		document.getElementById("copy-btn").textContent = "Copy All";
	}, 1500);
}
function saveHtml() {
	getFileName();
	const styledContent = styleDisplay.textContent;
	const blob = new Blob([styledContent], { type: "text/html" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${fileName}.html`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function getFileName() {
    let element = document.getElementById('P00001');
    let h1Text = element.querySelector('h1').textContent;
    if (h1Text) {
		fileName = h1Text.slice(0, 50);
		fileName = fileName.replace(/[^\w\s]/gi, ''); // Remove non-word characters
		document.title = `${fileName} - HTML-Document-Editor`;
	}
}

const styleDisplay = document.getElementById("style-display");
function updateStyleDisplay() {
	const prePagesContent = document.getElementById("pages").innerHTML;	
	const pagesContent = prePagesContent.replace(/styled-block selected/g, "styled-block");
	let styles = "";
	// Get styles for body and .page
	const bodyStyles = window.getComputedStyle(document.body);
	const pagesStyles = getComputedStyle(document.getElementById('pages'));
	
	// Body styles
	styles += `
		body {
			background-color: ${bodyStyles.backgroundColor};
		}
	`;
	
	// Page styles
	styles += `
		#pages {
			position: absolute;
			top: 0;
			left: 0;
			margin: 0 auto;
			box-sizing: border-box;
			background-color: ${pagesStyles.backgroundColor};
			color: ${pagesStyles.color};
			font-family: ${pagesStyles.fontFamily};
			font-size: ${pagesStyles.fontSize};
			font-weight: ${pagesStyles.fontWeight};
			
		}
	`;
	
	// Other Styles
	styles += `
		.styled-block {
			min-height: ${pagesStyles.fontSize};
		}
		.page {
			position: relative;
			width: ${pagesStyles.width};
			box-sizing: border-box;
			page-break-after: always;
			
			padding-top: ${pagePadToppx}px;
			padding-left: ${pagePadLeftpx}px;
			padding-right: ${pagePadRightpx}px;
			padding-bottom: ${pagePadBottompx}px;
			
			outline: 1px solid black;
		}
		@media print {
			.page {
				border: none;
				outline: none;
			}
		}
	`;
	// update style display
	const styleDisplay = document.getElementById("style-display");
	styleDisplay.textContent = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<style>${styles}</style>\n</head>\n<body>\n<div id="pages">\n<!-- ---------------start import--------------- -->\n${pagesContent}\n\n<!-----------------End Import--------------- -->\n</div>\n</body>\n</html>`;
}

// css filter script

	let img = "";
	const imageUrlInput = document.getElementById('image-url');
  const loadButton = document.getElementById('load-button');
  const image = document.getElementById('image');
  const zoomInput = document.getElementById('zoom');
  const zoomValueSpan = document.getElementById('zoom-value');
  const rotationInput = document.getElementById('rotation');
  const rotationValueSpan = document.getElementById('rotation-value');
  const brightnessInput = document.getElementById('brightness');
  const brightnessValueSpan = document.getElementById('brightness-value');
  const contrastInput = document.getElementById('contrast');
  const contrastValueSpan = document.getElementById('contrast-value');
  const hueInput = document.getElementById('hue');
  const hueValueSpan = document.getElementById('hue-value');
  const saturateInput = document.getElementById('saturate');
  const saturateValueSpan = document.getElementById('saturate-value');
  const invert = document.getElementById('invert');
  const blurInput = document.getElementById('blur');
  const blurValueSpan = document.getElementById('blur-value');
  const revertButton = document.getElementById('revert-button');

  loadButton.addEventListener('click', loadNewImage);
  zoomInput.addEventListener('input', updateZoomValue);
  rotationInput.addEventListener('input', updateRotationValue);
  brightnessInput.addEventListener('input', updateBrightnessValue);
  contrastInput.addEventListener('input', updateContrastValue);
  hueInput.addEventListener('input', updateHueValue);
  saturateInput.addEventListener('input', updateSaturateValue);
  invert.addEventListener('click', applyFilters);
  blurInput.addEventListener('input', updateBlurValue);
  revertButton.addEventListener('click', revertFilters);

  function loadNewImage() {
    const imageUrl = imageUrlInput.value;
    image.src = imageUrl;
	textInput.value = `<img src="${imageUrl}">`;
  }

  function applyFilters() {
	  img = imageUrlInput.value;
    const zoomValue = zoomInput.value;
    const rotationValue = rotationInput.value;
    const brightnessValue = document.getElementById('brightness').value;
    const contrastValue = document.getElementById('contrast').value;
    const hueValue = hueInput.value;
    const saturateValue = document.getElementById('saturate').value;
	const saturateValueSpan = document.getElementById('saturate-value');
    const invertValue = invert.checked ? 100 : 0;
    const blurValue = document.getElementById('blur').value;
	const blurValueSpan = document.getElementById('blur-value');

    // Add more filter values here

    const filters = `brightness(${brightnessValue}%) contrast(${contrastValue}%) hue-rotate(${hueValue}deg) saturate(${saturateValue}%) invert(${invertValue}%) blur(${blurValue}px)`;
    const transform = `rotate(${rotationValue}deg)`;

    image.style.filter = filters;
    image.style.transform = transform;
    image.style.maxWidth = `${zoomValue}px`;

    const cssCode = `<img src="${img}" style="filter: ${filters}; transform: ${transform}; max-width: ${zoomValue}px;">`;
	
    textInput.value = cssCode;
  }

function revertFilters() {
  zoomInput.value = '300';
  updateZoomValue();
  rotationInput.value = '0';
  updateRotationValue();
  brightnessInput.value = '100';
  updateBrightnessValue();
  contrastInput.value = '100';
  updateContrastValue();
  hueInput.value = '0';
  updateHueValue();
  saturateInput.value = '100';
  updateSaturateValue();
  invert.checked = false;
  blurInput.value = '0'
  updateBlurValue();
	textInput.value = "<p></p>";
}

function updateRotationValue() {
    const rotationValue = rotationInput.value;
    rotationValueSpan.textContent = `${rotationValue}`;
    applyFilters();
}

  function updateZoomValue() {
    const zoomValue = zoomInput.value;
    zoomValueSpan.textContent = `${zoomValue}`;
    applyFilters();
  }
  
  function updateBrightnessValue() {
	const brightnessValue = brightnessInput.value;
	brightnessValueSpan.textContent = `${brightnessValue}`;
	applyFilters();
  }
  
  function updateContrastValue() {
	const contrastValue = contrastInput.value;
	contrastValueSpan.textContent = `${contrastValue}`;
	applyFilters();
  }

  function updateHueValue() {
    const hueValue = hueInput.value;
    hueValueSpan.textContent = `${hueValue}`;
    applyFilters();
  }
  
  function updateSaturateValue() {
	const saturateValue = saturateInput.value;
	saturateValueSpan.textContent = `${saturateValue}`;
	applyFilters();
  }
  
  function updateBlurValue() {
    const blurValue = blurInput.value;
    blurValueSpan.textContent = `${blurValue}`;
    applyFilters();
  }
