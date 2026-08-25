import DiagnosticAndQuote from "../Schemas/diagnostics/DiagnosticAndQuote.js";

// Create a new diagnostic and quote
export const createDiagnosticAndQuote = async (req, res) => {
  try {
    const newDiagnosticAndQuote = new DiagnosticAndQuote(req.body);
    const savedDiagnosticAndQuote = await newDiagnosticAndQuote.save();

    res.status(201).json({
      success: true,
      message: 'Diagnostic and quote created successfully',
      data: savedDiagnosticAndQuote,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating diagnostic and quote',
      error: error.message,
    });
  }
};

// Get all diagnostic and quotes
export const getAllDiagnosticAndQuotes = async (req, res) => {
  try {
    const diagnostics = await DiagnosticAndQuote.find();

    res.status(200).json({
      success: true,
      count: diagnostics.length,
      data: diagnostics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching diagnostic and quotes',
      error: error.message,
    });
  }
};

// Get a diagnostic and quote by ID
export const getDiagnosticAndQuoteById = async (req, res) => {
  try {
    const diagnostic = await DiagnosticAndQuote.findById(req.params.id);

    if (!diagnostic) {
      return res.status(404).json({
        success: false,
        message: 'Diagnostic and quote not found',
      });
    }

    res.status(200).json({
      success: true,
      data: diagnostic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching diagnostic and quote',
      error: error.message,
    });
  }
};

// Update a diagnostic and quote
export const updateDiagnosticAndQuote = async (req, res) => {
  try {
    const updatedDiagnosticAndQuote = await DiagnosticAndQuote.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDiagnosticAndQuote) {
      return res.status(404).json({
        success: false,
        message: 'Diagnostic and quote not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Diagnostic and quote updated successfully',
      data: updatedDiagnosticAndQuote,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating diagnostic and quote',
      error: error.message,
    });
  }
};

// Delete a diagnostic and quote
export const deleteDiagnosticAndQuote = async (req, res) => {
  try {
    const deletedDiagnosticAndQuote = await DiagnosticAndQuote.findByIdAndDelete(req.params.id);

    if (!deletedDiagnosticAndQuote) {
      return res.status(404).json({
        success: false,
        message: 'Diagnostic and quote not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Diagnostic and quote deleted successfully',
      data: deletedDiagnosticAndQuote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting diagnostic and quote',
      error: error.message,
    });
  }
};
