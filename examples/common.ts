const getIndexLink = (): HTMLElement => {
  const currentPathElements = window.location.pathname.split('/');
  currentPathElements.pop();
  currentPathElements.pop();
  const p = document.createElement('p');
  const a = document.createElement('a');
  p.innerText = 'Back to the ';
  a.innerText = 'index page';
  a.target = '_blank';
  a.href = `${currentPathElements.join('/')}/`;
  p.appendChild(a);
  return p;
};

const getGitHubExampleLink = (): HTMLElement => {
  const baseUrl = 'https://github.com/geoblocks/ol-comfy/tree/main/examples';
  const currentExample = window.location.pathname.split('/').at(-2);
  const p = document.createElement('p');
  const a = document.createElement('a');
  p.innerText = 'To understand this example check the ';
  a.innerText = 'source code';
  a.target = '_blank';
  a.href = `${baseUrl}/${currentExample}/index.ts`;
  p.appendChild(a);
  return p;
};

const getGitHubIoDocLink = (): HTMLElement => {
  const baseUrl = 'https://geoblocks.github.io/ol-comfy/apidoc';
  const pageName = document
    .querySelector('#common-links')
    ?.getAttribute('data-page-name');
  let toKnowMore = ' to know more';
  if (pageName) {
    toKnowMore += ` about the ${pageName.split('_').join(' ')}`;
  }
  const p = document.createElement('p');
  const span1 = document.createElement('span');
  const span2 = document.createElement('span');
  const a = document.createElement('a');
  span1.innerText = 'Read the ';
  span2.innerText = toKnowMore;
  a.innerText = 'API documentation';
  a.target = '_blank';
  a.href = `${baseUrl}/${pageName ? 'modules/' + pageName + '.html' : 'index.html'}`;
  p.appendChild(span1);
  p.appendChild(a);
  p.appendChild(span2);
  return p;
};

const addCommonLinks = () => {
  document.querySelector('#common-links')?.appendChild(getIndexLink());
  document.querySelector('#common-links')?.appendChild(getGitHubExampleLink());
  document.querySelector('#common-links')?.appendChild(getGitHubIoDocLink());
};
addCommonLinks();
