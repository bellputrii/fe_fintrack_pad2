'use client'

// Hook Imports
import useVerticalNav from '@/hooks/useVerticalNavbar'

const SidebarToggle = () => {
  // Hooks
  const { toggleVerticalNav, isBreakpointReached } = useVerticalNav()

  const handleClick = () => {
    toggleVerticalNav()
  }

  return (
    <>
      {isBreakpointReached && <i className='ri-menu-line text-xl cursor-pointer' onClick={handleClick} />}
    </>
  )
}

export default SidebarToggle
