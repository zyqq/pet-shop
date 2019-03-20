import React, {
  Component
} from 'react';
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import AdoptionJson from './truffle/build/contracts/Adoption.json'

class App extends Component {
  constructor(props) {
    super(props)
    this.web3 = null
    this.Adoption = null
    this.init()
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
    console.log(AdoptionJson)
    this.Adoption = TruffleContract(AdoptionJson)
    this.Adoption.setProvider(this.web3Provider)
    return this.markAdopted()
  }
  async markAdopted() {
    const adoptionInstance = await this.Adoption.deployed()
    const adopters = await adoptionInstance.getAdopters.call()
    console.log(adopters)
  }
  async adopt(petId) {
    // 部署合约的地址
    const account = window.web3.eth.defaultAccount
    const adoptionInstance = await this.Adoption.deployed()
    await adoptionInstance.adopt(petId, { from: account })
    return this.markAdopted()
  }
  render(){
    return ( 
      <button onClick={() => this.adopt(2)}>领养第二个</button>
    );
  }
}

export default App;