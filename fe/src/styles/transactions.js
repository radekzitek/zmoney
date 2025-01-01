export const transactionStyles = {
  amountCell: (amount) => ({
    color: amount < 0 ? 'error.main' : 'success.main'
  })
}; 