import * as React from 'react'
import styled from 'styled-components'
import TaskScreen from './containers/TaskScreen'
import Sidebar from './containers/Sidebar'
import { actions, Provider } from './store'
import { lifecycle } from 'recompose'

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  height: calc(100% - 60px);
  flex: 1;
  min-width: 100%;
`

const Header = styled.div`
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 3px 1px -2px rgba(0, 0, 0, 0.1),
    0 1px 5px 0 rgba(0, 0, 0, 0.06);
  height: 60px;
  position: relative;
  background-color: #315096;
  padding: 0 16px;
  line-height: 60px;
  z-index: 10;
`

const Title = styled.h1`
  padding-top: 0;
  font-size: 18px;
  color: white;
  margin: 0;
  text-align: center;
  font-family: Lato, sans-serif;
`

const App = lifecycle({
  componentWillMount() {
    actions.loadCategories()
  }
})(() => (
  <Container>
    <Sidebar />
    <TaskScreen />
  </Container>
))

const Layout: React.SFC<{}> = () => (
  <Provider>
    <Header>
      <Title>ease.do</Title>
    </Header>
    <App />
  </Provider>
)

export default Layout
