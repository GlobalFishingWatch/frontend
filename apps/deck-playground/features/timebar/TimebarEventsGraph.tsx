import { useMemo } from 'react'
import {
  useVesselsLayerInstance,
  useVesselsLayerLoaded
} from 'layers/vessel/vessels.hooks'
import { TimebarTracksEvents } from '@globalfishingwatch/timebar'
const mockedData = [{
  color: "#f00",
  chunks: [
    {start: 1648556712000, type: 'fishing', id: 'c60c53ab4c3b994c62771c86c2cb9c58', end: 1648579326000},
    {start: 1648581786340, type: 'fishing', id: 'ec0053fa92b15b0d5363f18170c7335c', end: 1648598106000},
    {start: 1648598406000, type: 'fishing', id: '7e79f5aa1d5307a8f8e90955ffd9295f', end: 1648609512000},
    {start: 1648615678860, type: 'fishing', id: '6dcdb903a46d198f2d4b6a695268f778', end: 1648654205000},
    {start: 1648703365000, type: 'fishing', id: '7da7524dc706d12a7e1004cfbcb572d7', end: 1648722067240},
    {start: 1648723458000, type: 'fishing', id: '2147936a1623a392681ebd450a37d2ef', end: 1648741581070},
    {start: 1648788904000, type: 'fishing', id: 'aa9b1045d33d89b2dff4dee150eebd1a', end: 1648804804000},
    {start: 1648806077000, type: 'fishing', id: '4a867d61de42d93b8d1e9a953f6379ad', end: 1648831360000},
    {start: 1649048568000, type: 'fishing', id: 'b9d7024bf86b869ec910c795a280e8d4', end: 1649087223880},
    {start: 1649104802000, type: 'fishing', id: 'b934632b4ea70cd200e1b5ebbd8c4759', end: 1649116504000},
    {start: 1649116802000, type: 'fishing', id: 'f3e893072dc27144758120abe4b81e4e', end: 1649127901000},
    {start: 1649135791000, type: 'fishing', id: '1875ee9680ddbe5064f8d6df00f2cced', end: 1649167716160},
    {start: 1649219762000, type: 'fishing', id: '916f8aad5ff30389cafaef5016474cb5', end: 1649257202000},
    {start: 1649310004000, type: 'fishing', id: '96f62e034b614552095aa005f18dc0d6', end: 1649319003000},
    {start: 1649320010000, type: 'fishing', id: '1152fa6b216ad1754b8fd5441836e708', end: 1649338383000},
    {start: 1649650590000, type: 'fishing', id: '7ca497586466343bd6c95fb40bb5282f', end: 1649678160000},
    {start: 1649679901000, type: 'fishing', id: '04811fa7537d430ab95f5dffc1d5b43f', end: 1649686510000},
    {start: 1649738797000, type: 'fishing', id: 'ed114aa66a7ce85b63de6416850d9223', end: 1649774791000},
    {start: 1649824542000, type: 'fishing', id: 'a7afedd52df584d56c9fbaf3400e2e4a', end: 1649848026000},
    {start: 1649849252000, type: 'fishing', id: '70ac4d1023a105900e603b5e43723568', end: 1649861703000},
    {start: 1649911824000, type: 'fishing', id: 'bfd6d5dd4b9ccfadf3f70dc930cee05d', end: 1649979905000},
    {start: 1649980804000, type: 'fishing', id: 'f132168b0910c7b57e9558ed78bd74d7', end: 1649999104000},
    {start: 1650003005000, type: 'port_visit', id: '3caf41fe87c5dfb55b74bb3e1630bb6a', end: 1650032728000},
    {start: 1650259201000, type: 'port_visit', id: '71aa3b2f88c724688c03a5fd3c9cb76b', end: 1650297300000},
    {start: 1650344710000, type: 'port_visit', id: '3d84d309135a355a9e84d0cc3c492c30', end: 1650356709000},
    {start: 1650358200000, type: 'fishing', id: 'f4e75c322e71cda5cb72d9a29cd346d1', end: 1650379640000},
    {start: 1650411867000, type: 'fishing', id: '16eb25a450e571a62362a929ac97b827', end: 1650424801000},
    {start: 1650432301000, type: 'fishing', id: '070a61f5d8fc133026047ab1d325463e', end: 1650467121000},
    {start: 1650498600000, type: 'fishing', id: '8c102cb4799ccf89978942c4745414ec', end: 1650510301000},
    {start: 1650515789000, type: 'fishing', id: 'cb7b3537191f472e5980cee2082fa773', end: 1650550504000},
    {start: 1650856200000, type: 'fishing', id: '84a1478d91cb97a2b7973dbd67e2f709', end: 1650897585720},
    {start: 1650946092000, type: 'fishing', id: '39c8199ae53201f5e52cb236c43c755e', end: 1650982951000},
    {start: 1651032124000, type: 'fishing', id: '666ca480131de5bb9411846be478653b', end: 1651070830000},
    {start: 1651074862000, type: 'encounter', id: 'f3521542d9166e29f47fc4b0ea0530de', end: 1651103592000},
    {start: 1651104000000, type: 'fishing', id: 'c6cd733c4c5212de6ec672c4338c1891', end: 1651112401000},
    {start: 1651120802000, type: 'fishing', id: '919b5309b68ff29489096b0813280b2f', end: 1651141102000},
    {start: 1651142175000, type: 'fishing', id: '7c038219f7262eceadf89b42773a8ced', end: 1651155302000},
    {start: 1651201202000, type: 'fishing', id: '44e724f2c450b50526bd3cfb030a0e46', end: 1651202413000},
    {start: 1651206301000, type: 'fishing', id: '3a1f39db23e826586305d00345ed6adf', end: 1651218810520},
    {start: 1651219512000, type: 'port_visit', id: 'd91b2bdee7869333b80a108ad2b83964', end: 1651230305000},
    {start: 1651231512000, type: 'port_visit', id: '7c9147a30c38be525351d53369eb89bc', end: 1651238203000},
    {start: 1651465357750, type: 'fishing', id: '5eca71ca0504cdf92af3a347cb681384', end: 1651507257000},
    {start: 1651512096000, type: 'fishing', id: '141cfef22fcf9d75da84a11dc27a1ff1', end: 1651535586000},
    {start: 1651536186710, type: 'fishing', id: 'a741f2fb7916cbc784d0078385cb10b5', end: 1651543148000},
    {start: 1651550116000, type: 'port_visit', id: '33ce0a5fd735cea6dc670a873a25f856', end: 1651573500000},
    {start: 1651574737000, type: 'port_visit', id: 'b1ab36e8ef741c3accdb2864332026c7', end: 1651585523000},
    {start: 1651599030000, type: 'fishing', id: '2d5ff64a44bda4ecf745801bec19a594', end: 1651621605580},
    {start: 1651622405000, type: 'fishing', id: 'a1148e516badd01d4fb20c145460bbb2', end: 1651630203000},
    {start: 1651637378440, type: 'fishing', id: '0bf09b2dc9b1c53f51c922ec330e9240', end: 1651667417000}
  ]
},{
  color: "#00f",
  chunks: [
    {start: 1648556712000, type: 'fishing', id: 'c60c53ab4c3b994c62771c86c2cb9c58', end: 1648579326000},
    {start: 1648581786340, type: 'fishing', id: 'ec0053fa92b15b0d5363f18170c7335c', end: 1648598106000},
    {start: 1648598406000, type: 'fishing', id: '7e79f5aa1d5307a8f8e90955ffd9295f', end: 1648609512000},
    {start: 1648615678860, type: 'fishing', id: '6dcdb903a46d198f2d4b6a695268f778', end: 1648654205000},
    {start: 1648703365000, type: 'fishing', id: '7da7524dc706d12a7e1004cfbcb572d7', end: 1648722067240},
    {start: 1648723458000, type: 'fishing', id: '2147936a1623a392681ebd450a37d2ef', end: 1648741581070},
    {start: 1648788904000, type: 'fishing', id: 'aa9b1045d33d89b2dff4dee150eebd1a', end: 1648804804000},
    {start: 1648806077000, type: 'fishing', id: '4a867d61de42d93b8d1e9a953f6379ad', end: 1648831360000},
    {start: 1649048568000, type: 'fishing', id: 'b9d7024bf86b869ec910c795a280e8d4', end: 1649087223880},
    {start: 1649104802000, type: 'fishing', id: 'b934632b4ea70cd200e1b5ebbd8c4759', end: 1649116504000},
    {start: 1649116802000, type: 'fishing', id: 'f3e893072dc27144758120abe4b81e4e', end: 1649127901000},
    {start: 1649135791000, type: 'fishing', id: '1875ee9680ddbe5064f8d6df00f2cced', end: 1649167716160},
    {start: 1649219762000, type: 'fishing', id: '916f8aad5ff30389cafaef5016474cb5', end: 1649257202000},
    {start: 1649310004000, type: 'fishing', id: '96f62e034b614552095aa005f18dc0d6', end: 1649319003000},
    {start: 1649320010000, type: 'fishing', id: '1152fa6b216ad1754b8fd5441836e708', end: 1649338383000},
    {start: 1649650590000, type: 'fishing', id: '7ca497586466343bd6c95fb40bb5282f', end: 1649678160000},
    {start: 1649679901000, type: 'fishing', id: '04811fa7537d430ab95f5dffc1d5b43f', end: 1649686510000},
    {start: 1649738797000, type: 'fishing', id: 'ed114aa66a7ce85b63de6416850d9223', end: 1649774791000},
    {start: 1649824542000, type: 'fishing', id: 'a7afedd52df584d56c9fbaf3400e2e4a', end: 1649848026000},
    {start: 1649849252000, type: 'fishing', id: '70ac4d1023a105900e603b5e43723568', end: 1649861703000},
    {start: 1649911824000, type: 'fishing', id: 'bfd6d5dd4b9ccfadf3f70dc930cee05d', end: 1649979905000},
    {start: 1649980804000, type: 'fishing', id: 'f132168b0910c7b57e9558ed78bd74d7', end: 1649999104000},
    {start: 1650003005000, type: 'fishing', id: '3caf41fe87c5dfb55b74bb3e1630bb6a', end: 1650032728000},
    {start: 1650259201000, type: 'fishing', id: '71aa3b2f88c724688c03a5fd3c9cb76b', end: 1650297300000},
    {start: 1650344710000, type: 'fishing', id: '3d84d309135a355a9e84d0cc3c492c30', end: 1650356709000},
    {start: 1650358200000, type: 'fishing', id: 'f4e75c322e71cda5cb72d9a29cd346d1', end: 1650379640000},
    {start: 1650411867000, type: 'fishing', id: '16eb25a450e571a62362a929ac97b827', end: 1650424801000},
    {start: 1650432301000, type: 'fishing', id: '070a61f5d8fc133026047ab1d325463e', end: 1650467121000},
    {start: 1650498600000, type: 'fishing', id: '8c102cb4799ccf89978942c4745414ec', end: 1650510301000},
    {start: 1650515789000, type: 'fishing', id: 'cb7b3537191f472e5980cee2082fa773', end: 1650550504000},
    {start: 1650856200000, type: 'fishing', id: '84a1478d91cb97a2b7973dbd67e2f709', end: 1650897585720},
    {start: 1650946092000, type: 'fishing', id: '39c8199ae53201f5e52cb236c43c755e', end: 1650982951000},
    {start: 1651032124000, type: 'fishing', id: '666ca480131de5bb9411846be478653b', end: 1651070830000},
    {start: 1651074862000, type: 'fishing', id: 'f3521542d9166e29f47fc4b0ea0530de', end: 1651103592000},
    {start: 1651104000000, type: 'fishing', id: 'c6cd733c4c5212de6ec672c4338c1891', end: 1651112401000},
    {start: 1651120802000, type: 'fishing', id: '919b5309b68ff29489096b0813280b2f', end: 1651141102000},
    {start: 1651142175000, type: 'fishing', id: '7c038219f7262eceadf89b42773a8ced', end: 1651155302000},
    {start: 1651201202000, type: 'fishing', id: '44e724f2c450b50526bd3cfb030a0e46', end: 1651202413000},
    {start: 1651206301000, type: 'fishing', id: '3a1f39db23e826586305d00345ed6adf', end: 1651218810520},
    {start: 1651219512000, type: 'fishing', id: 'd91b2bdee7869333b80a108ad2b83964', end: 1651230305000},
    {start: 1651231512000, type: 'fishing', id: '7c9147a30c38be525351d53369eb89bc', end: 1651238203000},
    {start: 1651465357750, type: 'fishing', id: '5eca71ca0504cdf92af3a347cb681384', end: 1651507257000},
    {start: 1651512096000, type: 'fishing', id: '141cfef22fcf9d75da84a11dc27a1ff1', end: 1651535586000},
    {start: 1651536186710, type: 'fishing', id: 'a741f2fb7916cbc784d0078385cb10b5', end: 1651543148000},
    {start: 1651550116000, type: 'fishing', id: '33ce0a5fd735cea6dc670a873a25f856', end: 1651573500000},
    {start: 1651574737000, type: 'fishing', id: 'b1ab36e8ef741c3accdb2864332026c7', end: 1651585523000},
    {start: 1651599030000, type: 'fishing', id: '2d5ff64a44bda4ecf745801bec19a594', end: 1651621605580},
    {start: 1651622405000, type: 'fishing', id: 'a1148e516badd01d4fb20c145460bbb2', end: 1651630203000},
    {start: 1651637378440, type: 'fishing', id: '0bf09b2dc9b1c53f51c922ec330e9240', end: 1651667417000}
  ]
}]

  const TimebarVesselsEvents = () => {
  const vesselsLayerInstance = useVesselsLayerInstance()
  const vesselsLayerLoaded = useVesselsLayerLoaded()


  const eventsData = useMemo(() => {
    console.log("🚀 ~ file: TimebarEventsGraph.tsx ~ line 47 ~ eventsData ~ vesselsLayerLoaded", vesselsLayerLoaded)
    if (vesselsLayerInstance) {
      const vesselsEvents = vesselsLayerInstance.getVesselsLayers().reduce((acc, l) => [...acc, l.getVesselsEventsData()], [])
      console.log('vessels EVENTS', vesselsEvents)
      return mockedData
    }
    return []
  }, [vesselsLayerLoaded, vesselsLayerInstance])

  return eventsData?.length ? (
    <TimebarTracksEvents
      data={eventsData}
      onEventClick={(e) => console.log(e)}
    />
  ) : null
}

export default TimebarVesselsEvents
