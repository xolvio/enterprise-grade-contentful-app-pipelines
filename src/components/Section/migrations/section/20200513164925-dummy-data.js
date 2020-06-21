module.exports.description = "<Put your description here>";

module.exports.up = async (migration, { makeRequest }) => {
  await createSection(
    migration,
    { makeRequest },
    {
      id: "singleSection",
      heading: "Training",
      description:
        "Prepare your team and product for success. Team or 1-1 tuition on all aspects of test automation.",
      icon: "flipChartIcon",
    }
  );
};

module.exports.down = (migration) => {
  // Add your DOWN migration script here. See examples here:
  // https://github.com/contentful/migration-cli/tree/master/examples
};

const createSection = (migration, { makeRequest }, section) => {
  return makeRequest({
    method: "PUT",
    url: `/entries/${section.id}`,
    data: {
      fields: {
        heading: {
          "en-US": section.heading,
        },
        description: {
          "en-US": section.description,
        },
        icon: {
          "en-US": section.icon,
        },
      },
    },
    headers: {
      "X-Contentful-Content-Type": "section",
    },
  });
};

module.exports.createSection = createSection;
