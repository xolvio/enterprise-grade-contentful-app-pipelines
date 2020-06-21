module.exports.description = "Create content model for ServicesPage";

module.exports.up = (migration) => {
  const servicesPage = migration
    .createContentType("servicesPage")
    .name("ServicesPage")
    .displayField("title")
    .description("");

  servicesPage
    .createField("title")
    .name("title")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["title"] }])
    .linkType("Entry");

  servicesPage
    .createField("sections")
    .name("sections")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["sections"] }])
    .linkType("Entry");

  servicesPage.changeFieldControl("title", "builtin", "entryLinkEditor");
  servicesPage.changeFieldControl("sections", "builtin", "entryLinkEditor");
};

module.exports.down = (migration) =>
  migration.deleteContentType("servicesPage");
