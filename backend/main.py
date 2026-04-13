from flask import Flask, jsonify, request
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)

# Simulação de Banco de Dados em memória
# Estruturado conforme o objeto 'formData' do seu React
assistidos_db = [
    {
        "id": "1",
        "name": "Lucas Oliveira",
        "cpf": "111.222.333-44",
        "birthDate": "2018-06-15",
        "address": "Rua Júlio de Castilhos, 245 - Centro - Novo Hamburgo/RS",
        "phone": "(51) 99999-1111",
        "needsTransport": True,
        "usesCarSeat": True,
        "allergies": ["Alergia a amendoim", "Alergia a lactose"],
        "dietaryRestrictions": ["Restrição a lactose", "Restrição a glúten"],
        "specialNeeds": "TEA - Transtorno do Espectro Autista - Nível 2",
        "familyMembers": [
            {
                "id": "fam1",
                "name": "Sandra Oliveira",
                "relationship": "Mãe",
                "phone": "(51) 99999-1111",
                "allergies": [],
                "dietaryRestrictions": []
            }
        ],
        "status": "Ativo"
    },
    {
        "id": "2",
        "name": "Julia Santos",
        "cpf": "222.333.444-55",
        "birthDate": "2015-09-20",
        "address": "Av. Victor Barreto, 1580 - Centro - Novo Hamburgo/RS",
        "phone": "(51) 99999-2222",
        "needsTransport": True,
        "usesCarSeat": False,
        "allergies": [],
        "dietaryRestrictions": ["Dieta vegetariana"],
        "specialNeeds": "Cadeira de rodas - necessita de rampa de acesso",
        "familyMembers": [
            {
                "id": "fam2",
                "name": "Roberto Santos",
                "relationship": "Pai",
                "phone": "(51) 99999-2222",
                "allergies": [],
                "dietaryRestrictions": []
            }
        ],
        "status": "Ativo"
    },
    {
        "id": "3",
        "name": "Pedro Souza",
        "cpf": "333.444.555-66",
        "birthDate": "2020-03-10",
        "address": "Rua Gen. Osório, 890 - Hamburgo Velho - Novo Hamburgo/RS",
        "phone": "(51) 99999-3333",
        "needsTransport": False,
        "usesCarSeat": False,
        "allergies": ["Alergia a ovo"],
        "dietaryRestrictions": ["Restrição a ovo"],
        "specialNeeds": "",
        "familyMembers": [
            {
                "id": "fam3",
                "name": "Mariana Souza",
                "relationship": "Mãe",
                "phone": "(51) 99999-3333",
                "allergies": [],
                "dietaryRestrictions": []
            }
        ],
        "status": "Ativo"
    },
    {
        "id": "4",
        "name": "Ana Clara Lima",
        "cpf": "444.555.666-77",
        "birthDate": "2017-12-05",
        "address": "Rua Pedro Adams Filho, 456 - Rio Branco - Novo Hamburgo/RS",
        "phone": "(51) 99999-4444",
        "needsTransport": True,
        "usesCarSeat": False,
        "allergies": [],
        "dietaryRestrictions": [],
        "specialNeeds": "TDAH - Transtorno de Déficit de Atenção e Hiperatividade",
        "familyMembers": [],
        "status": "Ativo"
    },
    {
        "id": "5",
        "name": "Gabriel Ferreira",
        "cpf": "555.666.777-88",
        "birthDate": "2019-04-22",
        "address": "Rua Leopoldo Rassier, 320 - Pátria Nova - Novo Hamburgo/RS",
        "phone": "(51) 99999-5555",
        "needsTransport": True,
        "usesCarSeat": False,
        "allergies": ["Alergia a frutos do mar", "Alergia a corantes artificiais"],
        "dietaryRestrictions": ["Restrição a frutos do mar"],
        "specialNeeds": "Síndrome de Down - acompanhamento regular",
        "familyMembers": [
            {
                "id": "fam5",
                "name": "Camila Ferreira",
                "relationship": "Mãe",
                "phone": "(51) 99999-5555",
                "allergies": [],
                "dietaryRestrictions": []
            }
        ],
        "status": "Inativo"
    },
    {
        "id": "6",
        "name": "Mariana Costa",
        "cpf": "666.777.888-99",
        "birthDate": "2016-08-18",
        "address": "Av. Nações Unidas, 1250 - Santo Afonso - Novo Hamburgo/RS",
        "phone": "(51) 99999-6666",
        "needsTransport": True,
        "usesCarSeat": True,
        "allergies": ["Alergia a lactose"],
        "dietaryRestrictions": ["Restrição a lactose"],
        "specialNeeds": "Deficiência visual - baixa visão",
        "familyMembers": [
            {
                "id": "fam6",
                "name": "Patrícia Costa",
                "relationship": "Mãe",
                "phone": "(51) 99999-6666",
                "allergies": ["Alergia a penicilina"],
                "dietaryRestrictions": []
            }
        ],
        "status": "Ativo"
    },
    {
        "id": "7",
        "name": "Felipe Martins",
        "cpf": "777.888.999-00",
        "birthDate": "2019-10-25",
        "address": "Rua First, 780 - Ideal - Novo Hamburgo/RS",
        "phone": "(51) 99999-7777",
        "needsTransport": True,
        "usesCarSeat": False,
        "allergies": [],
        "dietaryRestrictions": [],
        "specialNeeds": "",
        "familyMembers": [
            {
                "id": "fam7",
                "name": "Maria Martins",
                "relationship": "Avó",
                "phone": "(51) 99999-7777",
                "allergies": [],
                "dietaryRestrictions": []
            }
        ],
        "status": "Ativo"
    },
    {
        "id": "8",
        "name": "Beatriz Rocha",
        "cpf": "888.999.000-11",
        "birthDate": "2021-01-08",
        "address": "Rua Boqueirão, 560 - Canudos - Novo Hamburgo/RS",
        "phone": "(51) 99999-8888",
        "needsTransport": False,
        "usesCarSeat": True,
        "allergies": ["Alergia a glúten", "Alergia a soja"],
        "dietaryRestrictions": ["Restrição a glúten", "Dieta vegana"],
        "specialNeeds": "TEA - Transtorno do Espectro Autista - Nível 1",
        "familyMembers": [
            {
                "id": "fam8",
                "name": "Fernanda Rocha",
                "relationship": "Mãe",
                "phone": "(51) 99999-8888",
                "allergies": ["Alergia a glúten"],
                "dietaryRestrictions": ["Restrição a glúten"]
            }
        ],
        "status": "Ativo"
    },
    {
        "id": "9",
        "name": "Enzo Almeida",
        "cpf": "999.000.111-22",
        "birthDate": "2017-05-30",
        "address": "Av. Dr. Maurício Cardoso, 980 - Hamburgo Velho - Novo Hamburgo/RS",
        "phone": "(51) 99999-9999",
        "needsTransport": True,
        "usesCarSeat": False,
        "allergies": [],
        "dietaryRestrictions": [],
        "specialNeeds": "Deficiência auditiva - utiliza aparelho auditivo",
        "familyMembers": [
            {
                "id": "fam9",
                "name": "Carlos Almeida",
                "relationship": "Pai",
                "phone": "(51) 99999-9999",
                "allergies": [],
                "dietaryRestrictions": []
            }
        ],
        "status": "Ativo"
    },
    {
        "id": "10",
        "name": "Sophia Pereira",
        "cpf": "000.111.222-33",
        "birthDate": "2020-07-12",
        "address": "Rua Independência, 340 - Rincão - Novo Hamburgo/RS",
        "phone": "(51) 99999-0000",
        "needsTransport": True,
        "usesCarSeat": True,
        "allergies": ["Alergia a amendoim", "Alergia a castanhas"],
        "dietaryRestrictions": ["Restrição a amendoim e castanhas"],
        "specialNeeds": "Paralisia cerebral - hemiplegia espástica",
        "familyMembers": [
            {
                "id": "fam10",
                "name": "Juliana Pereira",
                "relationship": "Mãe",
                "phone": "(51) 99999-0000",
                "allergies": [],
                "dietaryRestrictions": []
            },
            {
                "id": "fam11",
                "name": "Ricardo Pereira",
                "relationship": "Pai",
                "phone": "(51) 99999-0011",
                "allergies": [],
                "dietaryRestrictions": []
            }
        ],
        "status": "Ativo"
    },
    {
        "id": "11",
        "name": "Davi Nascimento",
        "cpf": "111.333.555-77",
        "birthDate": "2018-11-03",
        "address": "Rua São Jorge, 120 - Vila Rosa - Novo Hamburgo/RS",
        "phone": "(51) 99999-1010",
        "needsTransport": False,
        "usesCarSeat": False,
        "allergies": [],
        "dietaryRestrictions": [],
        "specialNeeds": "",
        "familyMembers": [
            {
                "id": "fam12",
                "name": "Adriana Nascimento",
                "relationship": "Mãe",
                "phone": "(51) 99999-1010",
                "allergies": [],
                "dietaryRestrictions": []
            }
        ],
        "status": "Ativo"
    },
    {
        "id": "12",
        "name": "Isabela Rodrigues",
        "cpf": "222.444.666-88",
        "birthDate": "2019-02-14",
        "address": "Rua Waldemar Roesler, 90 - Pátria Nova - Novo Hamburgo/RS",
        "phone": "(51) 99999-1212",
        "needsTransport": True,
        "usesCarSeat": False,
        "allergies": ["Alergia a picada de abelha"],
        "dietaryRestrictions": [],
        "specialNeeds": "TEA - Transtorno do Espectro Autista - Nível 3; TDAH",
        "familyMembers": [
            {
                "id": "fam13",
                "name": "Luciana Rodrigues",
                "relationship": "Mãe",
                "phone": "(51) 99999-1212",
                "allergies": [],
                "dietaryRestrictions": []
            }
        ],
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
        "usesCarSeat": data.get("usesCarSeat", False),
        "allergies": data.get("allergies", []),
        "dietaryRestrictions": data.get("dietaryRestrictions", []),
        "specialNeeds": data.get("specialNeeds", ""),
        # Campo para a lista de familiares que você criou
        "familyMembers": data.get("familyMembers", []),
        "status": data.get("status", "Ativo")
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