export const navbarStyles = {
  toolbar: {
    display: 'flex',
    gap: 2,
    alignItems: 'center'
  },
  logo: {
    marginRight: 2
  },
  menuSection: {
    display: 'flex',
    gap: 2,
    alignItems: 'center'
  },
  menuButton: (isActive) => ({
    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent'
  }),
  themeButton: {
    marginLeft: 1
  }
}; 