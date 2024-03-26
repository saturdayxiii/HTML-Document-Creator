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

const affectedArea = document.getElementById("blocks");
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
	if (wrappedText.startsWith("<div class=\"styled-block\"")) {
		affectedArea.insertAdjacentHTML("beforeend", wrappedText);
	} else {
		const styledBlock = createStyledBlock(wrappedText);
		if (selectedBlock) {
			selectedBlock.insertAdjacentElement("afterend", styledBlock);
		} else {
			affectedArea.appendChild(styledBlock);
		}
		if (alignmentSelect.value !== "left") {
			styledBlock.style.textAlign = alignmentSelect.value;
		}
	}

	updateStyleDisplay();
	textInput.value = "<p></p>";
	saveBtn.disabled = true;
});

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
		updatePageHeight();
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
	if (selectedBlock) {
		const prev = selectedBlock.previousElementSibling;
		if (prev) {
			selectedBlock.parentNode.insertBefore(selectedBlock, prev);
			updateStyleDisplay();
		}
	}
});
downBtn.addEventListener("click", () => {
	if (selectedBlock) {
		const next = selectedBlock.nextElementSibling;
		if (next) {
			selectedBlock.parentNode.insertBefore(next, selectedBlock);
			updateStyleDisplay();
		}
	}
});


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


const currentPage = document.querySelector(".page");
const pageWidthInput = document.getElementById("page-width");
const pageHeightInput = document.getElementById("page-height");
const pagePaddingTopInput = document.getElementById("page-padding-top");
const pagePaddingRightInput = document.getElementById("page-padding-right");
const pagePaddingBottomInput = document.getElementById("page-padding-bottom");
const pagePaddingLeftInput = document.getElementById("page-padding-left");
const pageColorPicker = document.getElementById("page-color-picker");
const pageTextColorPicker = document.getElementById("page-text-color-picker");
let totalPages = 1;
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
currentPage.style.backgroundColor = pageBackgroundColor;
currentPage.style.color = pageTextColor;
currentPage.style.fontFamily = `Arial`;
currentPage.style.fontSize = `1em`;
currentPage.style.fontWeight = 100;

pageColorPicker.addEventListener("input", () => {
	const selectedColor = pageColorPicker.value;
	if (selectedColor) {
		currentPage.style.backgroundColor = selectedColor;
		updateStyleDisplay();
	}
});
pageTextColorPicker.addEventListener("input", () => {
	const selectedColor = pageTextColorPicker.value;
	if (selectedColor) {
		pageTextColor = selectedColor; // Update the pageTextColor variable
		document.querySelector(".page").style.color = pageTextColor; // Update the text color for .page
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
		  setStyleProperty(currentPage, "fontFamily", input.value);
		} else if (input === dfaltFontSizeInput) {
		  setStyleProperty(currentPage, "fontSize", `${input.value}em`);
		} else if (input === dfaltFontWeightInput) {
		  setStyleProperty(currentPage, "fontWeight", input.value);
		}
	  });
	});


// Function to update styles
function updateStyles(tagName, fontFamilyId, fontSizeId, fontWeightId, defaultFontSize, defaultFontWeight) {
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
updateStyles('h1', 'h1-font-family', 'h1-font-size', 'h1-font-weight', 2, 900);
updateStyles('h2', 'h2-font-family', 'h2-font-size', 'h2-font-weight', 1.5, 600);
updateStyles('h3', 'h3-font-family', 'h3-font-size', 'h3-font-weight', 1, 600);
updateStyles('h4', 'h4-font-family', 'h4-font-size', 'h4-font-weight', 0.75, 100);

// Event listener for underline checkboxes
document.querySelectorAll('#text-rules input[id$="-uline"]').forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    const tagName = checkbox.id.split('-')[0];
    const isdefault = tagName === 'default';
    const page = document.querySelector('.page');

    const textDecoration = checkbox.checked ? 'underline' : 'none';
    if (isdefault) {
      page.style.textDecoration = textDecoration;
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
		const pageWidth = parseFloat(pageWidthInput.value);
		const pageMarginLeft = parseFloat(pagePaddingLeftInput.value);
		const pageMarginRight = parseFloat(pagePaddingRightInput.value);

		const totalPageWidth = pageWidth * 100 + pageMarginLeft * 100 + pageMarginRight * 100;
		const editorWidth = `calc(100vw - ${totalPageWidth}px - 20px)`; // Subtract the total page width and padding from the viewport width
		editor.style.width = editorWidth;
	}
	updateEditorWidth();
	

	function createStyledBlock(styledText) {
		const block = document.createElement("div");
		block.classList.add("styled-block");
		// this breaks html returning to editor. block.dataset.text = textInput.value;
		block.innerHTML = styledText;
		
		currentPage.appendChild(block);
		updatePageHeight();

		return block;
	}

	function calculateTotalBlocksHeight() {
		const styledBlocks = document.querySelectorAll(".styled-block");
		let totalBlocksHeight = 0;

		styledBlocks.forEach(block => {
			const paragraphs = block.querySelectorAll("p");
			const blockStyles = getComputedStyle(block);
			const paragraphsHeight = paragraphs.length * parseFloat(blockStyles.fontSize);
			totalBlocksHeight += block.offsetHeight + paragraphsHeight + 
				parseFloat(blockStyles.marginTop) +
				parseFloat(blockStyles.marginBottom) +
				parseFloat(blockStyles.paddingTop) +
				parseFloat(blockStyles.paddingBottom);
		});
		console.log(totalBlocksHeight);
		return totalBlocksHeight;
	}

	function pageTraits() {
		currentPage.style.width = `${pageWidthInput.value * 100}px`;
		currentPage.style.height = `${pageHeight * 100}px`;
		currentPage.style.paddingTop = `${pagePaddingTopInput.value * 100}px`;
		currentPage.style.paddingRight = `${pagePaddingRightInput.value * 100}px`;
		currentPage.style.paddingBottom = `${pagePaddingBottomInput.value * 100}px`;
		currentPage.style.paddingLeft = `${pagePaddingLeftInput.value * 100}px`;
	}

	// Add event listeners to update styles
	// Update page height when input values change
	const pageOptions = document.getElementById("page-options");
	pageOptions.addEventListener("input", function(event) {
		const target = event.target;
		if (target.matches("#page-width, #page-height, #page-padding-top, #page-padding-right, #page-padding-bottom, #page-padding-left, #page-color-picker, #page-text-color-picker")) {
			updatePageHeight();
		}
	});

	function updatePageHeight() {
		// Calculate totalBlocksHeight
		const totalBlocksHeight = calculateTotalBlocksHeight();
		// Calculate totalPages based on totalBlocksHeight and currentPageHeight
		const currentPageHeight = parseFloat(getComputedStyle(currentPage).height);
		const pageWidth = parseFloat(pageWidthInput.value);
		const pageHeight = parseFloat(pageHeightInput.value);
		if (totalBlocksHeight > currentPageHeight) {
			totalPages++;
		}
		// Generate additional pageSplit divs if needed
		const pagesDiv = document.getElementById("pages");
		const existingPageSplits = document.querySelectorAll(".pageSplit");
		const existingMarginhtops = document.querySelectorAll(".marginhtop");
		const existingMarginhbottoms = document.querySelectorAll(".marginhbottom");
		const existingMarginvlefts = document.querySelectorAll(".marginvleft");
		const existingMarginvrights = document.querySelectorAll(".marginvright");
		for (let i = existingPageSplits.length; i < totalPages; i++) {
			const newPageSplit = document.createElement("div");
			const newmarginhtop = document.createElement("div");
			const newmarginhbottom = document.createElement("div");
			const newmarginvleft = document.createElement("div");
			const newmarginvright = document.createElement("div");
			newPageSplit.classList.add("pageSplit");
			newmarginhtop.classList.add("marginhtop");
			newmarginhbottom.classList.add("marginhbottom");
			newmarginvleft.classList.add("marginvleft");
			newmarginvright.classList.add("marginvright");
			// Set position based on index and page height
			newPageSplit.style.width = `${pageWidth * 100}px`;
			newPageSplit.style.pageBreakAfter = `always`;
			pagesDiv.appendChild(newPageSplit);
			// Set marginh styles
			newmarginhtop.style.height = `${pagePaddingTopInput.value * 100}px`;
			newmarginhtop.style.top = `0`;
			newmarginhbottom.style.height = `${pagePaddingBottomInput.value * 100}px`;
			newmarginhbottom.style.bottom = `0`;
			newmarginvleft.style.width = `${pagePaddingLeftInput.value * 100}px`;
			newmarginvleft.style.left = `0`;
			newmarginvright.style.width = `${pagePaddingRightInput.value * 100}px`;
			newmarginvright.style.right = `0`;		
			// Add marginh elements into the newPageSplit
			newPageSplit.appendChild(newmarginhtop);
			newPageSplit.appendChild(newmarginhbottom);
			newPageSplit.appendChild(newmarginvleft);
			newPageSplit.appendChild(newmarginvright);
		}
		// Set styles for currentPage
		pageTraits();
		currentPage.style.height = `${totalPages * pageHeight * 100}px`; //redo height to include total pages
		// Update existing divs
		existingPageSplits.forEach(pagesplit => {
			pagesplit.style.height = `${pageHeight * 100}px`;
			pagesplit.style.width = `${pageWidth * 100}px`;
		});
		existingMarginhtops.forEach(marginhtop => {
				marginhtop.style.height = `${pagePaddingTopInput.value * 100}px`;
		});
		existingMarginhbottoms.forEach(marginhbottom => {
				marginhbottom.style.height = `${pagePaddingBottomInput.value * 100}px`;
		});
		existingMarginvlefts.forEach(marginvleft => {
				marginvleft.style.width = `${pagePaddingLeftInput.value * 100}px`;
		});
		existingMarginvrights.forEach(marginvright => {
				marginvright.style.width = `${pagePaddingRightInput.value * 100}px`;
		});

		updateStyleDisplay();
	}
	
	const pageContent = document.querySelector("#page").innerHTML;
	const styleDisplay = document.getElementById("style-display");
	// Set the initial values for inputs
	pageTraits();
	updatePageHeight();
	function copyAll() {
		navigator.clipboard.writeText(styleDisplay.textContent);
		document.getElementById("copy-btn").textContent = "";
		setTimeout(() => {
			document.getElementById("copy-btn").textContent = "Copy All";
		}, 1500);
	}
	function saveHtml() {
		const styledContent = styleDisplay.textContent;
		const blob = new Blob([styledContent], { type: "text/html" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "styledContent.html";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
	function updateStyleDisplay() {
		const pagesContent = document.getElementById("pages").innerHTML;
		const blockContent = document.getElementById("blocks").innerHTML;
		const styledBlocks = document.querySelectorAll(".styled-block");
		let html = "";
		// ---
		
		let styles = "";
		// Get styles for body and .page
		const bodyStyles = window.getComputedStyle(document.body);
		const pageStyles = window.getComputedStyle(document.querySelector(".page"));
		
		// Body styles
		styles += `
			body {
				background-color: ${bodyStyles.backgroundColor};
			}
		`;
		
		// Page styles
		styles += `
			.page {
				position: absolute;
				top: 0;
				left: 0;
				margin: 0 auto;
				box-sizing: border-box;
				width: ${pageStyles.width};
				height: ${pageStyles.height};
				padding-top: ${pageStyles.paddingTop};
				padding-right: ${pageStyles.paddingRight};
				padding-bottom: ${pageStyles.paddingBottom};
				padding-left: ${pageStyles.paddingLeft};
				background-color: ${pageStyles.backgroundColor};
				color: ${pageStyles.color};
				font-family: ${pageStyles.fontFamily};
				font-size: ${pageStyles.fontSize};
				font-weight: ${pageStyles.fontWeight};
			}
		`;
		
		// Other Styles
		styles += `
			.styled-block {
				min-height: ${pageStyles.fontSize};
			}
			.pageSplit {
				position: relative;
				box-sizing: border-box;
				z-index: 50;
				pointer-events: none;
				page-break-after: always;
			}
			@media print {
				.pageSplit {
					border-bottom: none;
				}
			}
		`;
		// update style display
		const styleDisplay = document.getElementById("style-display");
		styleDisplay.textContent = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<style>${styles}</style>\n</head>\n<body>\n<div class="page">\n${blockContent}\n</div>\n<div style="position:absolute;top:0;left:0;">${pagesContent}</div>\n</body>\n</html>`;
		}
		
