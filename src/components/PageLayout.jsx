import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useAuth0 } from '@auth0/auth0-react'
import { equals, map } from 'ramda'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useState } from 'react'
import { User } from '../types'

library.add(fas, far)

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  position: relative;
`

const MenuOption = styled(Link)`
  align-items: center;
  border-radius: 9999px;
  color: rgb(20, 23, 26);
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
  font-size: 20px;
  font-weight: ${({ active }) => (active ? 700 : 400)};
  gap: ${({ profile }) => (profile ? '0.5rem' : '1rem')};
  justify-content: ${({ profile }) => (profile ? 'center' : 'flex-start')};
  outline-style: none;
  padding: ${({ profile, collapsed }) => (profile && collapsed ? '0' : '1rem')};
  text-decoration: none;
  transition-duration: 0.2s;
  transition-property: background-color, box-shadow;

  :hover {
    ${({ profile, collapsed }) =>
      (!profile || !collapsed) && 'background-color: rgba(15, 20, 25, 0.1)'};
  }
`

const InnerMenuOption = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  max-width: 100%;
`

const Menu = styled.div`
  border-right: 1px solid rgb(239, 243, 244);
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  left: 0;
  min-height: 100%;
  padding: 1rem;
  padding-bottom: ${({ collapsed }) => (collapsed ? '3rem' : '2rem')};
  position: fixed;
  top: 0;
  user-select: none;
  width: ${({ collapsed }) => (collapsed ? '6rem' : '16rem')};
`

const TopMenuWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
`

const BottomMenuWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
`

const MenuIconWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
`

const ProfilePicture = styled.img`
  border-radius: 50%;
  height: 3rem;
  object-fit: cover;
  width: 3rem;
`

const ContentWrapper = styled.div`
  min-height: 100%;
  padding-left: ${({ collapsed }) => (collapsed ? '6rem' : '16rem')};
  width: 100%;
`

const ProfileOption = styled.div`
  align-items: flex-start;
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  justify-content: center;
`

const ProfileInfo = styled.span`
  max-width: 145px;
  text-overflow: ellipsis;
  overflow-x: hidden;
  white-space: nowrap;
`

const Name = styled(ProfileInfo)`
  font-weight: bold;
  font-size: 14px;
`

const Email = styled(ProfileInfo)`
  color: #666;
  font-size: 10px;
`

const SubMenu = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  bottom: ${({ collapsed }) => (collapsed ? '4rem' : '5rem')};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  left: ${({ collapsed }) => (collapsed ? '-1rem' : '9rem')};
  position: absolute;
  width: 6rem;
  z-index: 999;
`

const SubMenuItem = styled.div`
  padding: 8px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`

export const PageLayout = ({ user, children }) => {
  const { logout } = useAuth0()
  const { pathname } = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(null)
  const [showLogoutMenu, setShowLogoutMenu] = useState(false)

  const handleLogout = () =>
    logout({
      logoutParams: {
        returnTo: `${process.env.REACT_APP_BASE_URL}/logout/callback`
      }
    })

  const handleCollapse = () => {
    setIsCollapsed(prevValue => (prevValue ? null : 'true'))
  }

  if (!user) return children

  const menuOptions = [
    {
      to: '/',
      label: 'Home',
      testId: 'page-layout-menu-home',
      icon: 'fa-house'
    },
    {
      to: '/examples',
      label: 'Examples',
      testId: 'page-layout-menu-examples',
      icon: 'fa-table-cells-large'
    },
    {
      to: '/resources',
      label: 'Resources',
      testId: 'page-layout-menu-resources',
      icon: 'fa-book'
    }
  ]

  return (
    <Wrapper data-testid='page-layout'>
      <Menu data-testid='page-layout-menu' collapsed={isCollapsed}>
        <TopMenuWrapper>
          {isCollapsed && (
            <MenuOption onClick={handleCollapse}>
              <MenuIconWrapper>
                <FontAwesomeIcon
                  style={{ fontSize: '25px' }}
                  icon={['fas', 'fa-bars']}
                />
              </MenuIconWrapper>
            </MenuOption>
          )}
          {map(
            ({ to, label, testId, icon, iconType }) => (
              <MenuOption
                key={to}
                active={equals(pathname, to) ? 'true' : null}
                to={to}
                data-testid={testId}
                collapsed={isCollapsed}
              >
                <MenuIconWrapper>
                  <FontAwesomeIcon
                    style={{ fontSize: '25px' }}
                    icon={[iconType ?? 'fas', icon]}
                  />
                </MenuIconWrapper>
                <InnerMenuOption>{!isCollapsed && label}</InnerMenuOption>
              </MenuOption>
            ),
            menuOptions
          )}
        </TopMenuWrapper>
        <BottomMenuWrapper>
          {showLogoutMenu && (
            <SubMenu collapsed={isCollapsed}>
              <SubMenuItem
                data-testid='page-layout-menu-logout'
                onClick={handleLogout}
              >
                Logout
              </SubMenuItem>
            </SubMenu>
          )}
          {!isCollapsed && (
            <MenuOption
              onClick={handleCollapse}
              active={null}
              data-testid='page-layout-menu-collapse'
            >
              <MenuIconWrapper>
                <FontAwesomeIcon
                  style={{ fontSize: '25px' }}
                  icon={['fas', 'fa-arrow-left']}
                />
              </MenuIconWrapper>

              {isCollapsed ? null : <InnerMenuOption>Collapse</InnerMenuOption>}
            </MenuOption>
          )}
          <MenuOption
            data-testid='menu-profile-option'
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            collapsed={isCollapsed}
            profile='true'
          >
            <ProfilePicture src={user.picture} data-testid='user-image' />
            {!isCollapsed && (
              <ProfileOption>
                <Name>{user.fullName}</Name>
                <Email>{user.email}</Email>
              </ProfileOption>
            )}
          </MenuOption>
        </BottomMenuWrapper>
      </Menu>
      <ContentWrapper data-testid='page-layout-content' collapsed={isCollapsed}>
        {children}
      </ContentWrapper>
    </Wrapper>
  )
}

PageLayout.propTypes = {
  user: User,
  children: PropTypes.object
}
