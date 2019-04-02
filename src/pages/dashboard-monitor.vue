<template>
	<div> 
		<div id="cpu" :style="{float:'left',width: '50%', height: '500px'}"></div>
		<div id="mem" :style="{float:'right',width: '50%', height: '500px'}"></div>
		<div id="load" :style="{float:'left',width: '50%', height: '500px'}"></div>
    </div>
</template>
<script>
	import Axios from 'axios'
	export default {
	data () {
		return {
		  msg: 'ok'
		}
	},
	mounted(){
		this.drawLine();
	},
	methods: {
		drawLine(){
		    // 基于准备好的dom，初始化echarts实例
		    let cpu = this.$echarts.init(document.getElementById('cpu'))
		    let mem = this.$echarts.init(document.getElementById('mem'))
		    let load = this.$echarts.init(document.getElementById('load'))

		    Axios.get('/api/monitorDash/getMonitorItem')
		    	.then((response)=>{
		    	// 绘制图表
			    cpu.setOption({
			        title : {
				        text: 'cpu使用率分布图',
				        x:'center'
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    legend: {
				        orient: 'vertical',
				        left: 'left',
				        data: ['20%以下','20%~50%','50%~80%','80%以上']
				    },
				    series : [
				        {
				            name: 'cpu使用率分布图',
				            type: 'pie',
				            radius : '55%',
				            center: ['50%', '60%'],
				            data: response.data.cpu,
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        },
				        

				    ]

			    });
			    // 绘制图表
			    mem.setOption({
			        title : {
				        text: 'mem使用率分布图',
				        x:'center'
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    legend: {
				        orient: 'vertical',
				        left: 'left',
				        data: ['20%以下','20%~50%','50%~80%','80%以上']
				    },
				    series : [
				        {
				            name: 'mem使用率分布图',
				            type: 'pie',
				            radius : '55%',
				            center: ['50%', '60%'],
				            data:response.data.mem,
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ]
			    });
			    load.setOption({
			        title : {
				        text: 'load使用率分布图',
				        x:'center'
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    legend: {
				        orient: 'vertical',
				        left: 'left',
				        data: ['1以下','1~5','5~10','10以上']
				    },
				    series : [
				        {
				            name: 'mem使用率分布图',
				            type: 'pie',
				            radius : '55%',
				            center: ['50%', '60%'],
				            data:response.data.load5,
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ]
		    	});
		    }).catch((error)=>{
	        	console.log(error)
	        })
		    
		},
	}
}
</script>