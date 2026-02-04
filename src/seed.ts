import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Guest } from './guests/entities/guest.entity';
import { GuestGroup } from './guests/entities/guest-group.entity';
import { Gift } from './gifts/entities/gift.entity';
import { Repository } from 'typeorm';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const guestRepository = app.get<Repository<Guest>>(getRepositoryToken(Guest));
  const groupRepository = app.get<Repository<GuestGroup>>(getRepositoryToken(GuestGroup));
  const giftRepository = app.get<Repository<Gift>>(getRepositoryToken(Gift));

  console.log('Iniciando seed do banco de dados...');

  // Criar grupos/famílias
  const familiaAlexandre1 = await groupRepository.save({
    name: 'Família de Alexandre',
  });

  const familiaClarisse = await groupRepository.save({
    name: 'Família de Clarisse',
  });

  const familiaWilliam = await groupRepository.save({
    name: 'Família de William',
  });

  const familiaRaulino = await groupRepository.save({
    name: 'Família de Raulino',
  });

  const familiaDaniel = await groupRepository.save({
    name: 'Família de Daniel',
  });

  const familiaJoao = await groupRepository.save({
    name: 'Família de João',
  });

  const familiaFelipe = await groupRepository.save({
    name: 'Família de Felipe',
  });

  const familiaPablo = await groupRepository.save({
    name: 'Família de Pablo',
  });

  const familiaEdilene = await groupRepository.save({
    name: 'Família de Edilene',
  });

  const familiaLucas = await groupRepository.save({
    name: 'Família de Lucas',
  });

  const familiaCleniston = await groupRepository.save({
    name: 'Família de Cleniston',
  });

  const familiaClecia = await groupRepository.save({
    name: 'Família de Clecia',
  });

  const familiaCristina = await groupRepository.save({
    name: 'Família de Cristina',
  });

  const familiaJaninha = await groupRepository.save({
    name: 'Família de Janinha',
  });

  const familiaJussana = await groupRepository.save({
    name: 'Família de Jussana',
  });

  const familiaEdnalva = await groupRepository.save({
    name: 'Família de Ednalva',
  });

  const familiaThaires = await groupRepository.save({
    name: 'Família de Thaires',
  });

  const familiaJuliana = await groupRepository.save({
    name: 'Família de Juliana',
  });

  const familiaAleska = await groupRepository.save({
    name: 'Família de Aleska',
  });

  // Criar convidados em grupos
  await guestRepository.save([
    // Família de Alexandre (Grupo 1)
    { name: 'Alexandre', groupId: familiaAlexandre1.id, confirmed: false, isChild: false },
    { name: 'Gilza', groupId: familiaAlexandre1.id, confirmed: false, isChild: false },

    // Família de Clarisse (Grupo 2)
    { name: 'Clarisse', groupId: familiaClarisse.id, confirmed: false, isChild: false },
    { name: 'Sophie', groupId: familiaClarisse.id, confirmed: false, isChild: true },

    // Família de William (Grupo 6)
    { name: 'William', groupId: familiaWilliam.id, confirmed: false, isChild: false },
    { name: 'Natália', groupId: familiaWilliam.id, confirmed: false, isChild: false },

    // Família de Raulino (Grupo 7)
    { name: 'Raulino', groupId: familiaRaulino.id, confirmed: false, isChild: false },
    { name: 'Conceição', groupId: familiaRaulino.id, confirmed: false, isChild: false },
    { name: 'Bruna', groupId: familiaRaulino.id, confirmed: false, isChild: false },
    { name: 'Oliver', groupId: familiaRaulino.id, confirmed: false, isChild: false },

    // Família de Daniel (Grupo 8)
    { name: 'Daniel', groupId: familiaDaniel.id, confirmed: false, isChild: false },
    { name: 'Izabelle', groupId: familiaDaniel.id, confirmed: false, isChild: false },

    // Família de João (Grupo 9)
    { name: 'João', groupId: familiaJoao.id, confirmed: false, isChild: false },
    { name: 'Juli', groupId: familiaJoao.id, confirmed: false, isChild: false },
    { name: 'Pedrinho', groupId: familiaJoao.id, confirmed: false, isChild: true },

    // Família de Felipe (Grupo 10)
    { name: 'Felipe', groupId: familiaFelipe.id, confirmed: false, isChild: false },
    { name: 'Estela', groupId: familiaFelipe.id, confirmed: false, isChild: false },

    // Família de Pablo (Grupo 11)
    { name: 'Pablo', groupId: familiaPablo.id, confirmed: false, isChild: false },
    { name: 'Yasmin', groupId: familiaPablo.id, confirmed: false, isChild: false },

    // Família de Edilene (Grupo 12)
    { name: 'Edilene', groupId: familiaEdilene.id, confirmed: false, isChild: false },
    { name: 'Carlos', groupId: familiaEdilene.id, confirmed: false, isChild: false },
    { name: 'Emerson', groupId: familiaEdilene.id, confirmed: false, isChild: false },

    // Família de Lucas (Grupo 13)
    { name: 'Lucas', groupId: familiaLucas.id, confirmed: false, isChild: false },
    { name: 'Emilly', groupId: familiaLucas.id, confirmed: false, isChild: false },
    { name: 'Alice', groupId: familiaLucas.id, confirmed: false, isChild: true },
    { name: 'Aylla', groupId: familiaLucas.id, confirmed: false, isChild: true },

    // Família de Cleniston (Grupo 14)
    { name: 'Cleniston', groupId: familiaCleniston.id, confirmed: false, isChild: false },
    { name: 'Carla', groupId: familiaCleniston.id, confirmed: false, isChild: false },
    { name: 'Kessily', groupId: familiaCleniston.id, confirmed: false, isChild: false },
    { name: 'Ketilyn', groupId: familiaCleniston.id, confirmed: false, isChild: false },
    { name: 'Kimberly', groupId: familiaCleniston.id, confirmed: false, isChild: false },
    { name: 'Alexandre', groupId: familiaCleniston.id, confirmed: false, isChild: false },
    { name: 'Enzo', groupId: familiaCleniston.id, confirmed: false, isChild: true },

    // Família de Clecia (Grupo 15)
    { name: 'Clecia', groupId: familiaClecia.id, confirmed: false, isChild: false },
    { name: 'Diego', groupId: familiaClecia.id, confirmed: false, isChild: false },
    { name: 'Caiua', groupId: familiaClecia.id, confirmed: false, isChild: true },

    // Família de Cristina (Grupo 16)
    { name: 'Cristina', groupId: familiaCristina.id, confirmed: false, isChild: false },
    { name: 'Igor', groupId: familiaCristina.id, confirmed: false, isChild: false },
    { name: 'Thainã', groupId: familiaCristina.id, confirmed: false, isChild: false },
    { name: 'Thaphanie', groupId: familiaCristina.id, confirmed: false, isChild: true },
    { name: 'Jean', groupId: familiaCristina.id, confirmed: false, isChild: false },

    // Família de Janinha (Grupo 17)
    { name: 'Janinha', groupId: familiaJaninha.id, confirmed: false, isChild: false },
    { name: 'Tonho', groupId: familiaJaninha.id, confirmed: false, isChild: false },
    { name: 'Maria', groupId: familiaJaninha.id, confirmed: false, isChild: true },
    { name: 'Deoselia', groupId: familiaJaninha.id, confirmed: false, isChild: false },

    // Família de Jussana (Grupo 18)
    { name: 'Jussana', groupId: familiaJussana.id, confirmed: false, isChild: false },
    { name: 'Gil', groupId: familiaJussana.id, confirmed: false, isChild: false },
    { name: 'Daniel', groupId: familiaJussana.id, confirmed: false, isChild: false },
    { name: 'Rafael', groupId: familiaJussana.id, confirmed: false, isChild: false },

    // Família de Ednalva (Grupo 19)
    { name: 'Ednalva', groupId: familiaEdnalva.id, confirmed: false, isChild: false },
    { name: 'Joza', groupId: familiaEdnalva.id, confirmed: false, isChild: false },
    { name: 'Julia', groupId: familiaEdnalva.id, confirmed: false, isChild: false },
    { name: 'Rodrigo', groupId: familiaEdnalva.id, confirmed: false, isChild: false },
    { name: 'Fabinho', groupId: familiaEdnalva.id, confirmed: false, isChild: false },
    { name: 'Arthur', groupId: familiaEdnalva.id, confirmed: false, isChild: true },

    // Família de Thaires (Grupo 20)
    { name: 'Thaires', groupId: familiaThaires.id, confirmed: false, isChild: false },
    { name: 'Gabriel', groupId: familiaThaires.id, confirmed: false, isChild: false },

    // Família de Juliana (Grupo 21)
    { name: 'Juliana', groupId: familiaJuliana.id, confirmed: false, isChild: false },
    { name: 'Tairã', groupId: familiaJuliana.id, confirmed: false, isChild: false },
    { name: 'Arthur', groupId: familiaJuliana.id, confirmed: false, isChild: true },

    // Família de Aleska (Grupo 22)
    { name: 'Aleska', groupId: familiaAleska.id, confirmed: false, isChild: false },
    { name: 'Vanderson', groupId: familiaAleska.id, confirmed: false, isChild: false },
    { name: 'Adriele', groupId: familiaAleska.id, confirmed: false, isChild: true },
  ]);

  // Criar convidados individuais
  await guestRepository.save([
    { name: 'Maiko', confirmed: false, isChild: false },
    { name: 'Sophia', confirmed: false, isChild: false },
    { name: 'Edvanio', confirmed: false, isChild: false },
    { name: 'France', confirmed: false, isChild: false },
    { name: 'Juan', confirmed: false, isChild: false },
    { name: 'Vertinho', confirmed: false, isChild: false },
  ]);

  // Criar presentes
  await giftRepository.save([
    {
      title: 'Jogo de Panelas Antiaderente',
      description: 'Conjunto completo de panelas antiaderentes com 5 peças, ideal para o dia a dia da cozinha.',
      price: 299.90,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      purchased: false,
    },
    {
      title: 'Liquidificador Premium',
      description: 'Liquidificador de alta potência com 12 velocidades e função pulsar.',
      price: 189.90,
      image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop',
      purchased: false,
    },
    {
      title: 'Jogo de Cama Casal',
      description: 'Jogo de cama 100% algodão, 4 peças, macio e confortável.',
      price: 159.90,
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop',
      purchased: false,
    },
    {
      title: 'Cafeteira Elétrica',
      description: 'Cafeteira elétrica com capacidade para 30 xícaras, perfeita para receber visitas.',
      price: 129.90,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
      purchased: false,
    },
    {
      title: 'Conjunto de Toalhas',
      description: 'Kit com 6 toalhas de banho 100% algodão, super absorventes.',
      price: 89.90,
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',
      purchased: false,
    },
    {
      title: 'Micro-ondas Digital',
      description: 'Micro-ondas 20L com painel digital e 8 funções pré-programadas.',
      price: 449.90,
      image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop',
      purchased: false,
    },
    {
      title: 'Aspirador de Pó',
      description: 'Aspirador de pó com filtro HEPA e múltiplos acessórios.',
      price: 349.90,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      purchased: false,
    },
    {
      title: 'Ferro de Passar a Vapor',
      description: 'Ferro a vapor com base cerâmica e sistema anti-gotejamento.',
      price: 79.90,
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop',
      purchased: false,
    },
    {
      title: 'Jogo de Pratos',
      description: 'Aparelho de jantar 20 peças em porcelana branca, elegante e resistente.',
      price: 199.90,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      purchased: false,
    },
    {
      title: 'Ventilador de Teto',
      description: 'Ventilador de teto com 3 pás e controle remoto, silencioso e eficiente.',
      price: 259.90,
      image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=400&h=400&fit=crop',
      purchased: false,
    },
    {
      title: 'Conjunto de Facas',
      description: 'Kit com 6 facas profissionais em aço inox com suporte de madeira.',
      price: 149.90,
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&h=400&fit=crop',
      purchased: false,
    },
    {
      title: 'Chaleira Elétrica',
      description: 'Chaleira elétrica 1.7L com desligamento automático e base 360°.',
      price: 99.90,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      purchased: false,
    },
  ]);

  console.log('Dados dos convidados do casamento criados com sucesso!');
  console.log('Total de grupos/famílias: 22');
  console.log('Total de convidados em grupos: 66');
  console.log('Total de convidados individuais: 6');
  console.log('Total de crianças: 12');
  console.log('Total de presentes: 12');
  await app.close();
}

seed().catch(console.error);