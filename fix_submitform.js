// This is the fix for submitForm route
// Replace lines 47-50 with:

const eventDetails = {
  notes: notes || null,
  ...(typeof points === 'number' ? { customPoints: points } : {})
};

console.log("Fix ready - only store customPoints when it's a valid number");
