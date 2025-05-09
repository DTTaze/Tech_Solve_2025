const ReceiverInformationService = require("../services/receiverInformationService");

const handleCreateReceiverInfo = async (req, res) => {
  try {
    const result = await ReceiverInformationService.createReceiverInfo(req.body);
    return res.success("Receiver information created successfully", result);
  } catch (error) {
    console.error("Error create Receiver information:", error);
    return res.error(500, "Error create Receiver information", error.message || error);
  }
};

const handleGetReceiverInfoById = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    if (!id) return res.error(400, "Missing receiver ID");

    const result = await ReceiverInformationService.getReceiverInfoById(Number(id));
    if (!result) return res.error(404, "Receiver information not found");

    return res.success("Receiver information fetched successfully", result);
  } catch (error) {
    console.error("Error get Receiver information:", error);
    return res.error(500, "Error get Receiver information", error.message || error);
  }
};

const handleGetReceiverInfoByUserId = async (req, res) => {
  try {
    const id = req.params.user_id;
    if (!id) return res.error(400, "Missing receiver ID");

    const result = await ReceiverInformationService.getReceiverInfoByUserId(Number(id));

    return res.success("Receiver informations fetched successfully", result);
  } catch (error) {
    console.error("Error get Receiver information:", error);
    return res.error(500, "Error get Receiver information", error.message || error);
  }
}

const handleUpdateReceiverInfoById = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    const updateData = req.body;

    if (!id) return res.error(400, "Missing receiver ID");

    const result = await ReceiverInformationService.updateReceiverInfoById(Number(id), updateData);
    if (!result) return res.error(404, "Receiver information not found");

    return res.success("Receiver information updated successfully", result);
  } catch (error) {
    console.error("Error update Receiver information:", error);
    return res.error(500, "Error update Receiver information", error.message || error);
  }
};

const handleDeleteReceiverInfoById = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    if (!id) return res.error(400, "Missing receiver ID");

    const result = await ReceiverInformationService.deleteReceiverInfoById(Number(id));
    if (!result) return res.error(404, "Receiver information not found or already deleted");

    return res.success("Receiver information deleted successfully");
  } catch (error) {
    console.error("Error delete Receiver information:", error);
    return res.error(500, "Error delete Receiver information", error.message || error);
  }
};

module.exports = {
  handleCreateReceiverInfo,
  handleGetReceiverInfoById,
  handleGetReceiverInfoByUserId,
  handleUpdateReceiverInfoById,
  handleDeleteReceiverInfoById
};
