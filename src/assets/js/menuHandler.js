import { playSound } from './audioUtils.js';

export let titles = [".information()", ".tools()", ".navigator()"];

export let columns = [
  ['About Me', 'Software Development', 'Cybersecurity', 'Networking', 'Hacking'],
  ['HTML & CSS', 'JavaScript', 'Python', 'Svelte & Gsap', 'Rust'],
  ['Portfolio', 'Blog', 'Social Media', 'Contact']
];

// Function to handle arrow key navigation and tab navigation
export function handleKeydown(event, currentColumn, selectedIndex, showModal) {
  const oldIndex = selectedIndex;

  // Handle Arrow keys
  if (event.key === 'ArrowRight') {
    playSound("select");
    currentColumn = (currentColumn + 1) % columns.length;
    selectedIndex = Math.min(selectedIndex, columns[currentColumn].length - 1);
  }
  if (event.key === 'ArrowLeft') {
    playSound("select");
    currentColumn = (currentColumn - 1 + columns.length) % columns.length;
    selectedIndex = Math.min(selectedIndex, columns[currentColumn].length - 1);
  }
  if (event.key === 'ArrowDown') {
    if (selectedIndex < columns[currentColumn].length - 1) {
      selectedIndex += 1;
    }
  }
  if (event.key === 'ArrowUp') {
    if (selectedIndex > 0) {
      selectedIndex -= 1;
    }
  }

  // Play sound only if the index actually changed (this is so dumb)
  if (selectedIndex !== oldIndex) {
    playSound("select");
  }



  // Handle Tab and Shift + Tab keys
  if (event.key === 'Tab') {
    event.preventDefault();
    if (event.shiftKey) {
      event.preventDefault();
      if (selectedIndex === 0) {
        playSound("select");
        currentColumn = (currentColumn - 1 + columns.length) % columns.length; // Move to the previous column
        selectedIndex = columns[currentColumn].length - 1; // Go to the last item of the previous column
      } else {
        playSound("select");
        selectedIndex = selectedIndex - 1; // Move to the previous item within the same column
      }
    } else {
      // Tab (move to next item in the next column)
      if (selectedIndex === columns[currentColumn].length - 1) {
        playSound("select");
        currentColumn = (currentColumn + 1) % columns.length; // Move to the next column
        selectedIndex = 0; // Start from the first item of the next column
      } else {
        playSound("select");
        selectedIndex = selectedIndex + 1; // Move to the next item within the same column
      }
    }
  }

  // Handle Enter key
  if (event.key === 'Enter') {
    const selectedItem = columns[currentColumn][selectedIndex];
    handleClick(selectedItem, showModal);
  }

  // Return updated column and index
  return { currentColumn, selectedIndex };
}

// Function to handle mouse hover and remove class from all other selected items
export function handleMouseOver(colIndex, index, currentColumn, selectedIndex) {
  currentColumn = colIndex;
  selectedIndex = index;

  document.querySelectorAll('.hacker-border p').forEach(item => {
    item.classList.remove('selected');
  });

  const itemToSelect = document.querySelectorAll('.hacker-border')[colIndex].querySelectorAll('p')[index];
  itemToSelect.classList.add('selected');

  return [ currentColumn, selectedIndex ];
}

// Function to handle the click and enter keypress
export function handleClick(itemName, showModal) {
  console.log("[DEBUG] Selected: ", itemName);
  // Use the callback to show the modal
  showModal(`<strong>${itemName}</strong> selected!`);
}
