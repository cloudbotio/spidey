module.exports = {

	// Response handling
	response: {

		// do not change unless you know what you're doing
		success: "success",
		error: "error",
		unhandled_error: "Erro ao gerar resposta do servidor"
	},

	// Error Handling
	error: {

		unknown: "Erro desconhecido",

		// Error Levels
		critical: "Crítico",
		warning: "Aviso",

		// HTML Errors
		not_found: "Página não encontrada",
		internal: "Erro interno",
	},
	
	interpreter: {
		no_bundle: "Tarefa inválida, nenhum Bundle especificado",
	},
	
	bundle: {
		invalid: "Bundle incorreto ou inválido",
		no_url: "URL inválida ou não especificada",
		no_task: "Tarefa não especificada ou inválida",
		no_query: "Query de busca inválida ou não especificada",
	},

	type: {

		unknown: "O tipo especificado não é válido ou não está presente no sistema",

		// validation errors
		not_null: "O valor não pode ser nulo",
		not_numeric: "O valor especificado não é numérico",
		not_integer: "O valor especificado não é um número inteiro",
		not_string: "O valor especificado não é texto",
		not_encrypted: "O valor especificado não foi encriptado",
		not_enough_length: "O valor especificado deve possuir 8 ou mais caracteres",
		not_email: "O valor especificado não é um email válido",
		not_valid_domain: "O domínio do email especificado não é válido",
		not_object: "O valor especificado não é um objeto",
		not_array: "O valor especificado não é uma lista",
	},

	model: {

		encryption_error: "Erro ao encriptar o campo especificado",
		hash_error: "Erro ao gerar o hash",
		validation_error: "Erro ao validar o campo",
		not_from_framework: "O objeto especificado não é um Model válido, não é possível salvá-lo no banco",
		not_primary_key: "O objeto especificado não possui uma chave primária válida, o _id foi removido"
	},

	database: {
		query_error: "Erro ao conectar ao banco de dados"
	},

	// controllers

	home: {

		title: "spidey.cloudbot.io",
		message: "Bem vindo a pagina inicial do projeto!"
	},

	user: {

		email_registered: "Email já registrado no sistema",
		create_success: "Usuário criado com sucesso",
		create_error: "Erro ao criar novo usuário",

		not_logged_in: "Usuário não autenticado",

		invalid_credentials: "Credenciais inválidas ou incorretas",
		login_success: "Login efetuado com sucesso",
		login_error: "O login não pode ser efetuado",

		logout_success: "Logout efetuado com sucesso",
		logout_error: "O logout não pode ser efetuado",

		forbidden_access: "Acesso restrito, vocẽ não tem permissões administrativas",

		invalid_card: "O cartão de crédito inserido não é válido"
	}
}
