import axios from 'axios';

export interface AnvisaMedication {
  numeroRegistro: string;
  nomeProduto: string;
  expediente: string;
  razaoSocial: string;
  categoria: string;
  principioAtivo: string;
}

export interface SUSHealthUnit {
  cnes: string;
  nomeFantasia: string;
  endereco: string;
  telefone: string;
  municipio: string;
  uf: string;
}

export class GovernmentAPIService {
  private static readonly ANVISA_BASE_URL = 'https://consultas.anvisa.gov.br/api/consulta';
  private static readonly CNES_BASE_URL = 'https://cnes.datasus.gov.br/api';
  private static readonly IBGE_BASE_URL = 'https://servicodados.ibge.gov.br/api/v1';

  // Consulta medicamentos registrados na ANVISA
  static async searchMedication(medicationName: string): Promise<AnvisaMedication[]> {
    try {
      // Esta é uma simulação - a API real da ANVISA pode ter endpoints diferentes
      const response = await axios.get(`${this.ANVISA_BASE_URL}/medicamentos`, {
        params: {
          filter: medicationName,
          count: 10
        },
        timeout: 10000
      });
      
      return response.data.content || [];
    } catch (error) {
      console.error('Erro ao consultar medicamentos na ANVISA:', error);
      // Retorna dados simulados em caso de erro
      return this.getMockMedicationData(medicationName);
    }
  }

  // Busca unidades de saúde do SUS por localização
  static async searchHealthUnits(city: string, state: string): Promise<SUSHealthUnit[]> {
    try {
      // Esta é uma simulação - a API real do CNES pode ter endpoints diferentes
      const response = await axios.get(`${this.CNES_BASE_URL}/estabelecimentos`, {
        params: {
          municipio: city,
          uf: state,
          limit: 20
        },
        timeout: 10000
      });
      
      return response.data.content || [];
    } catch (error) {
      console.error('Erro ao consultar unidades de saúde:', error);
      // Retorna dados simulados em caso de erro
      return this.getMockHealthUnitsData(city, state);
    }
  }

  // Busca municípios por estado (IBGE)
  static async getCitiesByState(stateCode: string): Promise<string[]> {
    try {
      const response = await axios.get(
        `${this.IBGE_BASE_URL}/localidades/estados/${stateCode}/municipios`,
        { timeout: 10000 }
      );
      
      return response.data.map((city: any) => city.nome).sort();
    } catch (error) {
      console.error('Erro ao buscar municípios:', error);
      // Retorna dados simulados em caso de erro
      return this.getMockCitiesData(stateCode);
    }
  }

  // Verifica se medicamento está na lista RENAME (Relação Nacional de Medicamentos Essenciais)
  static async checkRENAMEList(medicationName: string): Promise<boolean> {
    try {
      // Esta seria uma consulta à base de dados do Ministério da Saúde
      // Por ora, é uma simulação
      const commonMedications = [
        'paracetamol', 'ibuprofeno', 'dipirona', 'omeprazol', 
        'sinvastatina', 'metformina', 'losartana', 'atenolol'
      ];
      
      return commonMedications.some(med => 
        medicationName.toLowerCase().includes(med)
      );
    } catch (error) {
      console.error('Erro ao verificar lista RENAME:', error);
      return false;
    }
  }

  // Dados simulados para fallback
  private static getMockMedicationData(medicationName: string): AnvisaMedication[] {
    return [
      {
        numeroRegistro: '1234567890',
        nomeProduto: `${medicationName} 500mg`,
        expediente: '25351.123456/2023-45',
        razaoSocial: 'Laboratório Farmacêutico Ltda',
        categoria: 'Medicamento',
        principioAtivo: medicationName
      }
    ];
  }

  private static getMockHealthUnitsData(city: string, state: string): SUSHealthUnit[] {
    return [
      {
        cnes: '1234567',
        nomeFantasia: `UBS Central ${city}`,
        endereco: `Rua Principal, 123 - ${city}/${state}`,
        telefone: '(11) 1234-5678',
        municipio: city,
        uf: state
      },
      {
        cnes: '2345678',
        nomeFantasia: `Hospital Municipal ${city}`,
        endereco: `Av. da Saúde, 456 - ${city}/${state}`,
        telefone: '(11) 2345-6789',
        municipio: city,
        uf: state
      }
    ];
  }

  private static getMockCitiesData(stateCode: string): string[] {
    const mockCities: { [key: string]: string[] } = {
      'SP': ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'Sorocaba'],
      'RJ': ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Nova Iguaçu', 'Duque de Caxias'],
      'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'],
      'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria']
    };
    
    return mockCities[stateCode] || [`Cidade Principal ${stateCode}`, `Cidade Secundária ${stateCode}`];
  }
}
