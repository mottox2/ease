import * as React from 'react'
import styled from 'styled-components'
import TaskScreen from './components/TaskScreen'
import Side from './components/Side'
import { actions, Provider } from './store'

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

class App extends React.Component {
  componentWillMount() {
    actions.loadCategories()
  }

  render() {
    return (
      <Container>
        <Side />
        <TaskScreen />
      </Container>
    )
  }
}

const Layout: React.SFC<{}> = () => (
  <React.Fragment>
    <Provider>
      <Header>
        <Title>ease.do</Title>
      </Header>
      <App />
    </Provider>
  </React.Fragment>
)

export default Layout
