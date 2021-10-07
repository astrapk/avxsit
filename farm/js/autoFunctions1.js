
let rewardPerYear;	

$(document).ready(function() {
	autoContract()
})

async function autoContract() {
	//try{
		const HttpProvider = Web3.providers.HttpProvider;
		const fullNode = new HttpProvider(network);
		const solidityNode = new HttpProvider(network);
		const eventServer = new HttpProvider(network);
		
		let web3 = new Web3(fullNode, solidityNode, eventServer)
			
		for(let i = 3; i < pools.length; i++){
			await (pools[i].contract = new web3.eth.Contract(pools[i].ABI, pools[i].addr))
			await (pools[i].swapContract = new web3.eth.Contract(pools[i].swapABI, pools[i].swapAddr))
		}
			
		await (farmAuto = new web3.eth.Contract(farmABI, farmAddress))
		await (farmAuto2 = new web3.eth.Contract(farm2ABI, farmAddress2))
		await (defyAuto = new web3.eth.Contract(defyABI, defy))
		await (wbnbAuto = new web3.eth.Contract(wbnbABI, wbnb))
		await (busdAuto = new web3.eth.Contract(wbnbABI, busd))
		await (elkAuto = new web3.eth.Contract(defyABI, elk))
		await (yakAuto = new web3.eth.Contract(defyABI, yak))
		await (pngAuto = new web3.eth.Contract(defyABI, png))
		await (gbAuto = new web3.eth.Contract(defyABI, gb))
		await (joeAuto = new web3.eth.Contract(defyABI, joe))
		await (teddyAuto = new web3.eth.Contract(defyABI, teddy))
		await (flumeAuto = new web3.eth.Contract(defyABI, flume))
		await (ilpAuto = new web3.eth.Contract(ilpABI, ilp))
		
    
		await (priceFeed = new web3.eth.Contract(priceFeedABI, priceFeedAddress))
		
		await (defyBnbApeAuto = new web3.eth.Contract(apePoolABI, defyBnbApeAddress))
		await (defyBusdApeAuto = new web3.eth.Contract(apePoolABI, defyBusdApeAddress))
        await (elkAvaxAuto = new web3.eth.Contract(apePoolABI, elkAvaxAddress))
		await (kinsElkAuto = new web3.eth.Contract(apePoolABI, kinsElkAddress))
        await (yakAvaxAuto = new web3.eth.Contract(apePoolABI, yakAvaxAddress))
		await (kinsYakAuto = new web3.eth.Contract(apePoolABI, kinsYakAddress))
        await (pngAvaxAuto = new web3.eth.Contract(apePoolABI, pngAvaxAddress))
		await (kinsPngAuto = new web3.eth.Contract(apePoolABI, kinsPngAddress))
        await (gbAvaxAuto = new web3.eth.Contract(apePoolABI, gbAvaxAddress))
		await (kinsGbAuto = new web3.eth.Contract(apePoolABI, kinsGbAddress))
        await (joeAvaxAuto = new web3.eth.Contract(apePoolABI, joeAvaxAddress))
		await (kinsJoeAuto = new web3.eth.Contract(apePoolABI, kinsJoeAddress))
        await (teddyAvaxAuto = new web3.eth.Contract(apePoolABI, teddyAvaxAddress))
        await (flumeAvaxAuto = new web3.eth.Contract(apePoolABI, flumeAvaxAddress))
		await (kinsTeddyAuto = new web3.eth.Contract(apePoolABI, kinsTeddyAddress))
		
    
		await (apeContract = new web3.eth.Contract(apeABI, apeAddress))
		
		await getApePrices()
		
		for(let i = 3; i < pools.length; i++){
			await autoBalances(i)
			getLiqTotals(i)
		}
		
		getSupply()
		setInterval(() => {
			refreshStats()
		}, 1000 * 10)
	/*
	}catch(e){
		console.log(e)
		setTimeout(() => {
			autoContract()
		}, 750)
	}
	*/
}
function refreshStats(){
	getSupply()
	getApePrices()
	for(i = 3; i < pools.length; i++){
		autoBalances(i)
		getLiqTotals(i)
	}
}	

async function getSupply(){
	let totalSupply = await (defyAuto.methods.totalSupply().call() / 1e18)
//	$('.total-supply')[0].innerHTML = '' +totalSupply.toFixed()
		
	let totalBurn = await (defyAuto.methods.totalBurn().call() / 1e18)
//	$('.total-burned')[0].innerHTML = '' +totalBurn.toFixed()

	//let ilpBalance = await defyAuto.methods.balanceOf(ilp).call() / 1e18
	//$('.ilp-defy-balance')[0].innerHTML = '' +ilpBalance
}


//let currentDefyToBusd

let currentBnbPriceToUsd

let walletInt

let currentApeBnbToDefy
let currentApeDefyToBnb
let currentAvaxToFlume

let currentApeBusdToDefy = 0
async function getApePrices(){
	let resDefyBnb = await defyBnbApeAuto.methods.getReserves().call()	
	let resDefyBusd = await defyBusdApeAuto.methods.getReserves().call()
	let roundData = await priceFeed.methods.latestRoundData().call()
	let resElkAvax = await elkAvaxAuto.methods.getReserves().call()	
	let resYakAvax = await yakAvaxAuto.methods.getReserves().call()	
	let resPngAvax = await pngAvaxAuto.methods.getReserves().call()	
	let resGbAvax = await gbAvaxAuto.methods.getReserves().call()	
	let resJoeAvax = await joeAvaxAuto.methods.getReserves().call()	
	let resTeddyAvax = await teddyAvaxAuto.methods.getReserves().call()	
	let resFlumeAvax = await flumeAvaxAuto.methods.getReserves().call()	
	currentBnbPriceToUsd = roundData.answer / 1e8
	
	currentApeBnbToDefy = await apeContract.methods.quote(toHexString(1e18), resDefyBnb._reserve1, resDefyBnb._reserve0).call() / 1e18
	currentApeDefyToBnb = await apeContract.methods.quote(toHexString(1e18), resDefyBnb._reserve0, resDefyBnb._reserve1).call() / 1e18
/* 	console.log(currentApeBnbToDefy)
	console.log(currentApeDefyToBnb) */
	
	currentApeBusdToDefy = await ilpAuto.methods.getKinsPrice(2).call() / 1e18
    
    currentAvaxToElk = await apeContract.methods.quote(toHexString(1e18), resElkAvax._reserve1, resElkAvax._reserve0).call() / 1e18
    currentAvaxToYak = await apeContract.methods.quote(toHexString(1e18), resYakAvax._reserve0, resYakAvax._reserve1).call() / 1e18
    currentAvaxToPng = await apeContract.methods.quote(toHexString(1e18), resPngAvax._reserve0, resPngAvax._reserve1).call() / 1e18
    currentAvaxToGb = await apeContract.methods.quote(toHexString(1e18), resGbAvax._reserve0, resGbAvax._reserve1).call() / 1e27
    currentAvaxToJoe = await apeContract.methods.quote(toHexString(1e18), resJoeAvax._reserve0, resJoeAvax._reserve1).call() / 1e18
    currentAvaxToTeddy = await apeContract.methods.quote(toHexString(1e18), resTeddyAvax._reserve0, resTeddyAvax._reserve1).call() / 1e18
    currentAvaxToFlume = await apeContract.methods.quote(toHexString(1e18), resFlumeAvax._reserve0, resFlumeAvax._reserve1).call() / 1e27
    
	
//	$('.defy-bnb-price')[0].innerHTML = '1 BNB = ~'+currentApeBnbToDefy.toFixed(2)+' DEFY'
//	$('.kins-price')[0].innerHTML = '$'+currentApeBusdToDefy.toFixed(2)
	
/*	walletInt = setInterval(() => {
		$('.wallet-balance')[0].innerHTML = (currentApeBusdToDefy * user.defy)+'$'
	}, 1000) */
}
async function autoBalances(pid){
	let contract = pools[pid].contract
   if (pid > 3 && pid != 11 && pid != 13){
	let swapContract = pools[pid].swapContract

	rewardPerYear = parseInt(await farmAuto.methods.kinsPerBlock().call()) * 60 * 60 * 24 * 365 / 1e18
	let poolInfo = await farmAuto.methods.poolInfo(pid).call()
    
	pools[pid].lpInFarm = parseInt(poolInfo.lpSupply) / 1e18
	
	let resLpToken = await contract.methods.getReserves().call()
	let currentLpTokenPrice = await swapContract.methods.quote(toHexString(1e18), resLpToken._reserve1, resLpToken._reserve0).call() / 1e18
		
	pools[pid].totalSupply = parseInt(await contract.methods.totalSupply().call()) / 1e18
    
   }  
        if(pid == 13 ){
        
    rewardPerYear2 = parseInt(await farmAuto2.methods.rewardPerBlock().call()) * 30 * 60 * 24 * 365 / 1e18
    
	pools[pid].lpInFarm = parseInt(await contract.methods.balanceOf(farmAddress2).call()) / 1e9


	
	pools[pid].totalSupply = parseInt(await contract.methods.totalSupply().call()) / 1e9

    }


let totalalloc = 800*2
    
	if(pid == 3){
		let kinspoolInfo = await farmAuto.methods.poolInfo(3).call()
    
		let kinsInFarm = parseInt(kinspoolInfo.lpSupply) / 1e18

		$('.pool-apy-'+pid)[0].innerHTML = '' + (rewardPerYear / ( totalalloc/200 * (kinsInFarm)) * 100).toFixed(2) + '%'
	}
	if(pid == 4){
		pools[pid].defyBal = parseInt(await defyAuto.methods.balanceOf(pools[pid].addr).call()) / 1e18
		$('.pool-apy-'+pid)[0].innerHTML = '' + (rewardPerYear / ( totalalloc/250 * (pools[pid].lpInFarm / pools[pid].totalSupply) * pools[pid].defyBal) * 100).toFixed(2) + '%'
	}
    if(pid == 5){
		pools[pid].defyBal = parseInt(await defyAuto.methods.balanceOf(pools[pid].addr).call()) / 1e18
		$('.pool-apy-'+pid)[0].innerHTML = '' + (rewardPerYear / ( totalalloc/250 * (pools[pid].lpInFarm / pools[pid].totalSupply) * pools[pid].defyBal) * 100).toFixed(2) + '%'
	}
    if(pid == 6){
		pools[pid].defyBal = parseInt(await defyAuto.methods.balanceOf(pools[pid].addr).call()) / 1e18
		$('.pool-apy-'+pid)[0].innerHTML = '' + (rewardPerYear / ( totalalloc/50 * (pools[pid].lpInFarm / pools[pid].totalSupply) * pools[pid].defyBal) * 100).toFixed(2) + '%'
	}
    if(pid == 11){
		let wavaxpoolInfo = await farmAuto.methods.poolInfo(11).call()
    
		let wavaxInFarm = parseInt(wavaxpoolInfo.lpSupply) / 1e18

		$('.pool-apy-'+pid)[0].innerHTML = '' + (rewardPerYear / ( totalalloc/25 * (wavaxInFarm * currentApeBnbToDefy)) * 100).toFixed(2) + '%'
	}
    if(pid > 6  && pid != 11 && pid != 13){
		pools[pid].defyBal = parseInt(await defyAuto.methods.balanceOf(pools[pid].addr).call()) / 1e18
		$('.pool-apy-'+pid)[0].innerHTML = '' + (rewardPerYear / ( totalalloc/25 * (pools[pid].lpInFarm / pools[pid].totalSupply) * pools[pid].defyBal) * 100).toFixed(2) + '%'
	}
    if(pid == 13){
		let flumepoolInfo = await farmAuto2.methods.poolInfo(0).call()
    
		let flumeInFarm = parseInt(flumepoolInfo.lpSupply) * currentAvaxToFlume * currentApeBnbToDefy / 1e9

		$('.pool-apy-'+pid)[0].innerHTML = '' + (rewardPerYear2 / (flumeInFarm) * 100).toFixed(2) + '%'
	}

}
function getLiqTotals(pid){
	if(pid == 3)
		getKinsLiq(pid)
	if(pid == 4)
		getApeDefyBnbLiq(pid)
    if(pid == 5)
		getApeDefyBusdLiq(pid)
    if(pid == 6)
		getKinsElkLiq(pid)
    if(pid == 7)
		getKinsYakLiq(pid)
    if(pid == 8)
		getKinsPngLiq(pid)
    if(pid == 9)
		getKinsGbLiq(pid)
    if(pid == 10)
		getKinsJoeLiq(pid)
    if(pid == 11)
		getWavaxLiq(pid)
    if(pid == 12)
		getKinsTeddyLiq(pid)
    if(pid == 13)
		getFlumeLiq(pid)


}


async function getKinsLiq(pid){

	let kinspoolInfo = await farmAuto.methods.poolInfo(3).call()
    
	let kinsInFarm = parseInt(kinspoolInfo.lpSupply) / 1e18

	let totalLiqInFarm = currentApeBusdToDefy * (kinsInFarm)
	
//	$('.pool-liq-'+pid)[0].innerHTML = "" + totalLiqInFarm.toFixed(2)+'$'
	$('.total-pool-liq-'+pid)[0].innerHTML = "" + totalLiqInFarm.toFixed(2)+'$'
}
async function getApeDefyBnbLiq(pid){
	let token0Pool = await defyAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token0Dec
	let token1Pool = await wbnbAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token1Dec
			
	pools[pid].lpTokenValueTotal = (currentApeBusdToDefy * token0Pool) + (token1Pool * currentBnbPriceToUsd)

	let totalLiqInFarm = pools[pid].lpTokenValueTotal * (pools[pid].lpInFarm*1e18) / (pools[pid].totalSupply*1e18)
	
//	$('.pool-liq-'+pid)[0].innerHTML = "" + totalLiqInFarm.toFixed(2)+'$'
	$('.total-pool-liq-'+pid)[0].innerHTML = "" + pools[pid].lpTokenValueTotal.toFixed(2)+'$'
}
async function getApeDefyBusdLiq(pid){
	let token0Pool = await defyAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token0Dec
	let token1Pool = await busdAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token1Dec
		
	pools[pid].lpTokenValueTotal = (currentApeBusdToDefy*token0Pool)*2
	let totalLiqInFarm = pools[pid].lpTokenValueTotal * (pools[pid].lpInFarm*1e18) / (pools[pid].totalSupply*1e18)
	
//	$('.pool-liq-'+pid)[0].innerHTML = "" + totalLiqInFarm.toFixed(2)+'$'
	$('.total-pool-liq-'+pid)[0].innerHTML = "" + pools[pid].lpTokenValueTotal.toFixed(2)+'$'
}
async function getKinsElkLiq(pid){
	let token0Pool = await defyAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token0Dec
	let token1Pool = await elkAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token1Dec
			
	pools[pid].lpTokenValueTotal = (currentBnbPriceToUsd * currentAvaxToElk * token1Pool) + (token0Pool * currentApeBusdToDefy)

	let totalLiqInFarm = pools[pid].lpTokenValueTotal * (pools[pid].lpInFarm*1e18) / (pools[pid].totalSupply*1e18)
	
//	$('.pool-liq-'+pid)[0].innerHTML = "" + totalLiqInFarm.toFixed(2)+'$'
	$('.total-pool-liq-'+pid)[0].innerHTML = "" + pools[pid].lpTokenValueTotal.toFixed(2)+'$'
}
async function getKinsYakLiq(pid){
	let token0Pool = await defyAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token0Dec
	let token1Pool = await yakAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token1Dec
			
	pools[pid].lpTokenValueTotal = (currentBnbPriceToUsd * currentAvaxToYak * token1Pool) + (token0Pool * currentApeBusdToDefy)

	let totalLiqInFarm = pools[pid].lpTokenValueTotal * (pools[pid].lpInFarm*1e18) / (pools[pid].totalSupply*1e18)
	
//	$('.pool-liq-'+pid)[0].innerHTML = "" + totalLiqInFarm.toFixed(2)+'$'
	$('.total-pool-liq-'+pid)[0].innerHTML = "" + pools[pid].lpTokenValueTotal.toFixed(2)+'$'
}
async function getKinsPngLiq(pid){
	let token0Pool = await defyAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token0Dec
	let token1Pool = await pngAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token1Dec
			
	pools[pid].lpTokenValueTotal = (currentBnbPriceToUsd * currentAvaxToPng * token1Pool) + (token0Pool * currentApeBusdToDefy)

	let totalLiqInFarm = pools[pid].lpTokenValueTotal * (pools[pid].lpInFarm*1e18) / (pools[pid].totalSupply*1e18)
	
//	$('.pool-liq-'+pid)[0].innerHTML = "" + totalLiqInFarm.toFixed(2)+'$'
	$('.total-pool-liq-'+pid)[0].innerHTML = "" + pools[pid].lpTokenValueTotal.toFixed(2)+'$'
}
async function getKinsGbLiq(pid){
	let token0Pool = await defyAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token0Dec
	let token1Pool = await gbAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token1Dec
			
	pools[pid].lpTokenValueTotal =(currentBnbPriceToUsd * currentAvaxToGb * token1Pool) + (token0Pool * currentApeBusdToDefy)

	let totalLiqInFarm = pools[pid].lpTokenValueTotal * (pools[pid].lpInFarm*1e18) / (pools[pid].totalSupply*1e18)
	
//	$('.pool-liq-'+pid)[0].innerHTML = "" + totalLiqInFarm.toFixed(2)+'$'
	$('.total-pool-liq-'+pid)[0].innerHTML = "" + pools[pid].lpTokenValueTotal.toFixed(2)+'$'
}
async function getKinsJoeLiq(pid){
	let token0Pool = await defyAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token0Dec
	let token1Pool = await joeAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token1Dec
			
	pools[pid].lpTokenValueTotal = (currentBnbPriceToUsd * currentAvaxToJoe * token1Pool) + (token0Pool * currentApeBusdToDefy)

	let totalLiqInFarm = pools[pid].lpTokenValueTotal * (pools[pid].lpInFarm*1e18) / (pools[pid].totalSupply*1e18)
	
//	$('.pool-liq-'+pid)[0].innerHTML = "" + totalLiqInFarm.toFixed(2)+'$'
	$('.total-pool-liq-'+pid)[0].innerHTML = "" + pools[pid].lpTokenValueTotal.toFixed(2)+'$'
}
async function getWavaxLiq(pid){

	let wavaxpoolInfo = await farmAuto.methods.poolInfo(11).call()
    
	let wavaxInFarm = parseInt(wavaxpoolInfo.lpSupply) / 1e18

	let totalLiqInFarm = currentBnbPriceToUsd * (wavaxInFarm)
	
//	$('.pool-liq-'+pid)[0].innerHTML = "" + totalLiqInFarm.toFixed(2)+'$'
	$('.total-pool-liq-'+pid)[0].innerHTML = "" + totalLiqInFarm.toFixed(2)+'$'
}
async function getKinsTeddyLiq(pid){
	let token0Pool = await defyAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token0Dec
	let token1Pool = await teddyAuto.methods.balanceOf(pools[pid].addr).call() / pools[pid].token1Dec
			
	pools[pid].lpTokenValueTotal = (currentBnbPriceToUsd * currentAvaxToTeddy * token1Pool) + (token0Pool * currentApeBusdToDefy)

	let totalLiqInFarm = pools[pid].lpTokenValueTotal * (pools[pid].lpInFarm*1e18) / (pools[pid].totalSupply*1e18)
	
//	$('.pool-liq-'+pid)[0].innerHTML = "" + totalLiqInFarm.toFixed(2)+'$'
	$('.total-pool-liq-'+pid)[0].innerHTML = "" + pools[pid].lpTokenValueTotal.toFixed(2)+'$'
}
async function getFlumeLiq(pid){
    
		let flumepoolInfo = await farmAuto2.methods.poolInfo(0).call()
    
		let flumeInFarm = parseInt(flumepoolInfo.lpSupply) * currentAvaxToFlume  / 1e9
        pools[pid].lpTokenValueTotal = currentAvaxToFlume * currentBnbPriceToUsd

	let totalLiqInFarm = currentBnbPriceToUsd * (flumeInFarm)
	
//	$('.pool-liq-'+pid)[0].innerHTML = "" + totalLiqInFarm.toFixed(2)+'$'
	$('.total-pool-liq-'+pid)[0].innerHTML = "" + totalLiqInFarm.toFixed(2)+'$'

}