console.log("VCC Classroom Launcher loaded");

const site = window.CLASSROOM_SITE;
const pageSections = document.getElementById("pageSections");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");

const homePage = site.pages[site.startPage];

pageTitle.textContent = homePage.header;

if (homePage.subtitle) {
  pageSubtitle.textContent = homePage.subtitle;
  pageSubtitle.hidden = false;
}

pageSections.innerHTML = `
  <section class="page-section">
    <h2 class="section-heading">Application shell is working</h2>
    <p>
      The page data loaded successfully. The next step is to generate the image tiles.
    </p>
  </section>
`;
