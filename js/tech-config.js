// tech-config.js
// CENTRAL PLACE FOR ALL TECH DATA — edit here only!

const techStacks = {
  'index': [                    // homepage
    { name: 'HTML5', category: 'Language', color: '#E34F26', desc: 'Structure & semantics' },
    { name: 'CSS3', category: 'Language', color: '#1572B6', desc: 'Styling & animations' },
    { name: 'JavaScript', category: 'Language', color: '#F7DF1E', desc: 'Interactivity' },
    { name: 'GitHub Pages', category: 'Tool', color: '#181717', desc: 'Hosting' }
  ],
  'projects': [
    { name: 'HTML5', category: 'Language', color: '#E34F26' },
    { name: 'CSS3', category: 'Language', color: '#1572B6' },
    { name: 'JavaScript', category: 'Language', color: '#F7DF1E' }
    // add more pages here as you create them
  ],
  // Add every page here. Use filename without .html
};

window.techStacks = techStacks; // expose globally
