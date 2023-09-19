import { serverMock } from "@/settings"

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  roles: state => state.user.roles,
  hamburger: state => state.app.hamburger,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  user:state => serverMock?state.mockUser:state.user,
  token: state => state.user.token,
  name: state => serverMock?state.mockUser.name:state.user.name,
  avatar: state => serverMock?state.mockUser.avatar:state.user.avatar,
  grade: state => serverMock?state.mockUser.grade:state.user.grade,
  permission:state => state.permission,
  mockpermission:state => state.mockpermission
}
export default getters
