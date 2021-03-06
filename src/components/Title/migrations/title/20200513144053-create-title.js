module.exports.description = "Create content model for Title";

module.exports.up = (migration) => {
  const title = migration
    .createContentType("title")
    .name("Title")
    .displayField("subheading")
    .description("");

  title
    .createField("subheading")
    .name("subheading")
    .type("Symbol")
    .required(true);

  title.createField("heading").name("heading").type("Symbol").required(true);

  title.changeFieldControl("subheading", "builtin", "singleLine");
  title.changeFieldControl("heading", "builtin", "singleLine");
};

module.exports.down = (migration) => migration.deleteContentType("title");
