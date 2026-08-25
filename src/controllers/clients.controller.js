import Client from '../Schemas/clientsSchema/ClientsDetails.js';

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdOn: -1 });
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve clients', error: error.message });
  }
};

export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    return res.status(200).json(client);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve client', error: error.message });
  }
};

export const searchClients = async (req, res) => {
  try {
    const { name, phone } = req.query;
    if (!name && !phone) {
      return res.status(400).json({ message: 'Please provide name or phone to search' });
    }

    const searchConditions = [];
    if (name) {
      searchConditions.push({ name: { $regex: name, $options: 'i' } });
    }
    if (phone) {
      searchConditions.push({ phone: { $regex: phone, $options: 'i' } });
    }

    const clients = await Client.find({ $or: searchConditions }).sort({ createdOn: -1 });
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to search clients', error: error.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const { VehiclesDetails, ...clientData } = req.body;
    const newClient = new Client(clientData);

    if (VehiclesDetails && Array.isArray(VehiclesDetails)) {
      newClient.VehiclesDetails = VehiclesDetails;
    }

    const savedClient = await newClient.save();
    return res.status(201).json(savedClient);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create client', error: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { VehiclesDetails, ...updateData } = req.body;

    const updatePayload = { ...updateData };
    if (VehiclesDetails && Array.isArray(VehiclesDetails)) {
      updatePayload.VehiclesDetails = VehiclesDetails;
    }

    const updatedClient = await Client.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });
    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }
    return res.status(200).json(updatedClient);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update client', error: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClient = await Client.findByIdAndDelete(id);
    if (!deletedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }
    return res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete client', error: error.message });
  }
};

