from flask import Flask, jsonify, request
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)

# Simulação de Banco de Dados em memória
# Estruturado conforme o objeto 'formData' do seu React
assistidos_db = [
    {
        "id": "1",
        "name": "Criança de Teste 01",
        "cpf": "000.000.000-00",
        "phone": "(11) 98888-8888",
        "status": "Ativo"
    },
    {
        "id": "2",
        "name": "Criança de Teste 02",
        "cpf": "111.111.111-11",
        "phone": "(11) 97777-7777",
        "status": "Em espera"
    }
]

@app.route('/api/assistidos', methods=['GET'])
def listar_assistidos():
    return jsonify(assistidos_db), 200

@app.route('/api/assistidos', methods=['POST'])
def cadastrar_assistido():
    data = request.get_json()

    # Extraindo os campos exatamente como estão no seu useState (formData)
    novo_assistido = {
        "id": str(len(assistidos_db) + 1),
        "name": data.get("name"),
        "cpf": data.get("cpf"),
        "birthDate": data.get("birthDate"),
        "address": data.get("address"),
        "phone": data.get("phone"),
        "needsTransport": data.get("needsTransport", False),
        "allergies": data.get("allergies", ""),
        "dietaryRestrictions": data.get("dietaryRestrictions", ""),
        "specialNeeds": data.get("specialNeeds", ""),
        # Campo para a lista de familiares que você criou
        "familyMembers": data.get("familyMembers", []) 
    }

    # Validação simples de campos obrigatórios (conforme seu handleSubmit)
    campos_obrigatorios = ["name", "cpf", "birthDate", "phone"]
    for campo in campos_obrigatorios:
        if not novo_assistido[campo]:
            return jsonify({"erro": f"O campo {campo} é obrigatório"}), 400

    assistidos_db.append(novo_assistido)
    
    print(f"Novo cadastro recebido: {novo_assistido['name']}") # Log no terminal
    return jsonify({
        "mensagem": "Assistido cadastrado com sucesso!",
        "id": novo_assistido["id"]
    }), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)