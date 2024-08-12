"use strict";

const { deleteDdbItem } = require("../lib/helper/awsDDBHelper");
const { handleSuccess, handleError } = require("../lib/helper/responseHelper");
const config = require("../lib/utils/config");

module.exports.handler = async (event) => {
  console.log("Delete Coffee : Start");

  try {
    console.log("Event:", JSON.stringify(event, null, 2));

    const { id } = event.pathParameters || {};

    if (!id) {
      return handleError("Invalid parameters", 400);
    }

    let result = null;
    result = await deleteDdbItem(`${config.project_name}-${config.stage}-Coffee`, id);

    return handleSuccess({ result });
  } catch (err) {
    return handleError(err.message);
  }
};
