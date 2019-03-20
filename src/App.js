import React, {
  Component
} from 'react';
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import AdoptionJson from './truffle/build/contracts/Adoption.json'
import pets from './truffle/src/pets.json'
import { Button, Layout, Row, Col } from 'antd';
import './App.css'

const {
  Header, Footer, Content,
} = Layout;

class App extends Component {
  constructor(props) {
    super(props)
    this.web3 = null
    this.Adoption = null
    this.initAddress = '0x' + '0'.repeat(40)
    this.init()
    this.state = {
      adopters: []
    }
  }
  init() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider
    } else {
      alert('请安装metamask')
    }
    this.web3 = new Web3(this.web3Provider)
    this.initAdoption()
  }
  initAdoption() {
    this.Adoption = TruffleContract(AdoptionJson)
    this.Adoption.setProvider(this.web3Provider)
    return this.markAdopted()
  }
  async markAdopted() {
    const adoptionInstance = await this.Adoption.deployed()
    const adopters = await adoptionInstance.getAdopters.call()
    this.setState({
      adopters
    })
    console.log(adopters)
  }
  async adopt(petId) {
    // 部署合约的地址
    const account = window.web3.eth.defaultAccount
    const adoptionInstance = await this.Adoption.deployed()
    await adoptionInstance.adopt(petId, { from: account })
    return this.markAdopted()
  }
  isActive(i) {
    return this.state.adopters[i] === this.initAddress
  }
  render(){
    return ( 
      <Layout className="layout">
        <Header>
        </Header>
        <Content style={{ padding: '20px 50px' }}>
          <Row gutter={40}>
          {
            pets.map((v, i) => {
              return (
                <Col span={6} key={i}>
                  <img src={v.picture} alt='' />
                  <div className='center'>
                    <p>{v.name}</p>
                    { this.isActive(i)
                        ? <Button type='primary' onClick={() => this.adopt(i)} >领养</Button>
                        : <Button disabled>已被领养</Button>
                    }
                  </div>
                </Col>
              )
            })
          }
          </Row>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Pet Shop ©2019 Created by Echo
        </Footer>
      </Layout>
      // <Button type='primary' onClick={() => this.adopt(2)}>领养第二个</Button>
    );
  }
}

export default App;