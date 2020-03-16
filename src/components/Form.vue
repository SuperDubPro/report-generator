<template>
	<div>
		<form>
			<label>
				Название оборудования:
				<input v-model="data.equipmentName">
			</label>
			<label>
				Адресс:
				<input v-model="data.objectAddress">
			</label>
			<label>
				Организация клиента:
				<input v-model="data.consumerOrganization">
			</label>
			<label>
				Номер договора:
				<input v-model="data.contract.name">
			</label>
			<label>
				Имя клиента:
				<input v-model="data.contract.person">
			</label>
			<button @click="handleButtonCLick">Создать отчет</button>
		</form>
	</div>
</template>

<script>
	// import createReport from 'docx-templates';
	import axios from 'axios';
	import bus from '../bus';

	export default {
		name: "Form",
		data() {
			return {
				templateFile: null,
				data: {
					equipmentName: 'Супер-пупер оборудование',
					objectAddress: 'Москва, Ереванская 24',
					consumerOrganization: 'ООО Рога и копыта',
					contract:{
						name:'Самый лучший номер договора',
						person: 'Иванов Петр Кузьмич'
					}
				},
				filesArr: []
			}
		},
		computed: {

		},
		methods: {
			handleTemplateChange(e) {
				this.$set(this, 'templateFile', e.target.files[0]);
			},
			handleButtonCLick() {
				axios({
					method: 'post',
					url: 'http://localhost:3001/',
					data: this.data
				})
			},
			async setFilesArr() {
				const res = await axios.get('http://localhost:3001/');
				this.$set(this, 'filesArr', res.data);
			}
		},
		async mounted() {
			await this.setFilesArr();
			bus.$emit('filesArr', this.filesArr);
		}
	}
</script>

<style lang="scss" scoped>
	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		width: 80%;
		margin: auto;
		label {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			width: 100%;
			margin: 8px 0 8px 0;
			input {
				width: 80%;
				margin: 8px 0 8px 0;
			}
		}
		button {
			width: 120px;
			margin: 8px 0 8px 0;
		}
	}
</style>