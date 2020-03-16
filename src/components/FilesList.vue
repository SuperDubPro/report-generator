<template>
	<div id="filesList">
		<div v-for="file in filesArr" class="file" :key="file">{{file}}</div>
	</div>
</template>

<script>
	import bus from '../bus';

	export default {
		name: "FilesList",
		data() {
			return {
				filesArr: [],
			}
		},
		methods: {
			setFilesArr(filesArr) {
				this.$set(this, 'filesArr', filesArr);
			}
		},
		mounted() {
			bus.$on('filesArr', this.setFilesArr);
		},
		beforeDestroy() {
			bus.$off('filesArr', this.setFilesArr);
		}
	}
</script>

<style lang="scss" scoped>
	#filesList {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		width: 160px;
		border: #2c3e50 solid 1px;
		border-radius: 4px;
		margin: 0 16px 0 16px;
		.file {
			width: 100%;
			text-align: start;
			padding: 4px 0 4px 8px;
			&:hover {
				color: #42b983;
			}
		}
	}
</style>