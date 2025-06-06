const deliveryAccountService = require("../services/deliveryAccountService");

const handleGetAllDeliveryAccounts = async (req, res) => {
  try {
    const userId = req.user.id;
    const accounts =
      await deliveryAccountService.getAllDeliveryAccounts(userId);
    return res.success("Get all delivery accounts success", accounts);
  } catch (error) {
    return res.error(500, "Get all delivery accounts failed", error.message);
  }
};

const handleGetDeliveryAccountById = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await deliveryAccountService.getDeliveryAccountById(id);
    return res.success("Get delivery account success", account);
  } catch (error) {
    return res.error(500, "Get delivery account failed", error.message);
  }
};

const handleCreateDeliveryAccount = async (req, res) => {
  try {
    const data = req.body;
    const account = await deliveryAccountService.createDeliveryAccount(data);
    return res.success("Create delivery account success", account);
  } catch (error) {
    return res.error(500, "Create delivery account failed", error.message);
  }
};

const handleUpdateDeliveryAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const account = await deliveryAccountService.updateDeliveryAccount(
      id,
      data
    );
    return res.success("Update delivery account success", account);
  } catch (error) {
    return res.error(500, "Update delivery account failed", error.message);
  }
};

const handleDeleteDeliveryAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deliveryAccountService.deleteDeliveryAccount(id);
    return res.success("Delete delivery account success", result);
  } catch (error) {
    return res.error(500, "Delete delivery account failed", error.message);
  }
};

const handleSetDefaultDeliveryAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await deliveryAccountService.setDefaultDeliveryAccount(
      id
    );
    return res.success("Set default delivery account success", account);
  } catch (error) {
    return res.error(500, "Set default delivery account failed", error.message);
  }
};

module.exports = {
  handleGetAllDeliveryAccounts,
  handleGetDeliveryAccountById,
  handleCreateDeliveryAccount,
  handleUpdateDeliveryAccount,
  handleDeleteDeliveryAccount,
  handleSetDefaultDeliveryAccount,
};
