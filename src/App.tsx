import * as React from 'react'
import styled from 'styled-components'
import TaskScreen from './components/TaskScreen'

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  height: calc(100% - 60px);
  flex: 1;
  min-width: 100%;
`

const Sidebar = styled.div`
  width: 260px;
  padding: 24px;
`

const Header = styled.div`
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 3px 1px -2px rgba(0, 0, 0, 0.1),
    0 1px 5px 0 rgba(0, 0, 0, 0.06);
  height: 60px;
  position: relative;
  background-color: #315096;
  padding: 0 16px;
  line-height: 60px;
`

const SidebarItem = styled.div`
  padding: 12px 12px;
  opacity: 0.88;
  font-size: 15px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #f0f0f0;
  }
  small {
    margin-left: 4px;
    font-family: Helvetica, sans-serif;
    opacity: 0.66;
  }
`

const Main = styled.div`
  flex: 1;
  background-color: #fff;
  border-right: 1px solid #eee;
  border-left: 1px solid #eee;
  padding: 40px;
  border-left: 1px solid #eee;
`

const Title = styled.h1`
  padding-top: 0;
  font-size: 15px;
  color: white;
  margin: 0;
`
const App: React.SFC<{}> = () => (
  <React.Fragment>
    <Header>
      <Title>ease.do</Title>
    </Header>
    <Container>
      <Sidebar>
        <SidebarItem>すべてのタスク</SidebarItem>
      </Sidebar>
      <Main>
        <TaskScreen />
      </Main>
    </Container>
  </React.Fragment>
)

export default App
