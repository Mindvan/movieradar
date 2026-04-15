import { MenuOutlined } from '@ant-design/icons'
import { Button, Drawer, Space, Typography } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../app/providers/AuthContext'
import { useNavigate } from 'react-router-dom'

export function HeaderActions() {
  const navigate = useNavigate()
  const { isAuthorized, logout } = useContext(AuthContext)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 900
  })
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const goTo = (path: string) => {
    navigate(path)
    setDrawerOpen(false)
  }

  const handleLogout = () => {
    logout()
    setDrawerOpen(false)
  }

  const desktopLinks = (
    <>
      {isAuthorized ? (
        <>
          <Typography.Link onClick={() => navigate('/profile')}>My profile</Typography.Link>
          <Typography.Link onClick={() => navigate('/schedule')}>Schedule</Typography.Link>
          <Typography.Link onClick={logout}>Log out</Typography.Link>
        </>
      ) : (
        <>
          <Typography.Link onClick={() => navigate('/schedule')}>Schedule</Typography.Link>
          <Typography.Link onClick={() => navigate('/login')}>Login</Typography.Link>
        </>
      )}
    </>
  )

  const mobileLinks = (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {isAuthorized ? (
        <>
          <Typography.Link onClick={() => goTo('/profile')}>My profile</Typography.Link>
          <Typography.Link onClick={() => goTo('/schedule')}>Schedule</Typography.Link>
          <Typography.Link onClick={handleLogout}>Log out</Typography.Link>
        </>
      ) : (
        <>
          <Typography.Link onClick={() => goTo('/schedule')}>Schedule</Typography.Link>
          <Typography.Link onClick={() => goTo('/login')}>Login</Typography.Link>
        </>
      )}
    </Space>
  )

  if (isMobile) {
    return (
      <>
        <Button
          type="text"
          icon={<MenuOutlined />}
          aria-label="Open navigation menu"
          className="header-menu-button"
          onClick={() => setDrawerOpen(true)}
        />
        <Drawer
          title="Menu"
          placement="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          {mobileLinks}
        </Drawer>
      </>
    )
  }

  return <Space size="middle" align="center" className="header-actions">{desktopLinks}</Space>
}
