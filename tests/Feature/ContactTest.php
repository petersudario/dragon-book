<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Contact;

class ContactTest extends TestCase
{
    use RefreshDatabase;

  /**
   * Testa a criação bem-sucedida de um contato.
   *
   * @return void
   */
  public function test_contact_creation_successful()
  {
      // Cria um usuário autenticado
      $user = User::factory()->create();

      $validCpf = $this->generateValidCpf();

      $data = [
          'nome' => 'Teste Manaus',
          'cpf' => $validCpf,
          'telefone' => '(92) 91234-5678',
          'cep' => '69000-000',
          'endereco' => 'Avenida Eduardo Gomes, Centro, Manaus - AM, Brasil',
          'latitude' => '-3.119027',
          'longitude' => '-60.021731',
          'complemento' => 'Casa',
      ];

      // Envia uma requisição POST autenticada para criar o contato
      $response = $this->actingAs($user)->postJson('/contacts', $data);

      // Verifica se a resposta tem status 201 (Criado)
      $response->assertStatus(201);

      // Verifica a estrutura da resposta JSON
      $response->assertJsonStructure([
          'contact' => [
              'id',
              'nome',
              'cpf',
              'telefone',
              'cep',
              'endereco',
              'latitude',
              'longitude',
              'complemento',
              'user_id',
              'created_at',
              'updated_at',
          ],
      ]);

      // Verifica se o contato foi salvo no banco de dados
      $this->assertDatabaseHas('contacts', [
          'nome' => 'Teste Manaus',
          'cpf' => $validCpf,
          'telefone' => '(92) 91234-5678',
          'cep' => '69000-000',
          'endereco' => 'Avenida Eduardo Gomes, Centro, Manaus - AM, Brasil',
          'latitude' => '-3.119027',
          'longitude' => '-60.021731',
          'complemento' => 'Casa',
          'user_id' => $user->id,
      ]);
  }



/**
 * Gera um CPF válido.
 *
 * @return string
 */
  private function generateValidCpf()
  {
      $n1 = rand(0, 9);
      $n2 = rand(0, 9);
      $n3 = rand(0, 9);
      $n4 = rand(0, 9);
      $n5 = rand(0, 9);
      $n6 = rand(0, 9);
      $n7 = rand(0, 9);
      $n8 = rand(0, 9);
      $n9 = rand(0, 9);

      // Calcula o primeiro dígito verificador
      $d1 = 0;
      for ($i = 0, $j = 10; $i < 9; $i++, $j--) {
          $d1 += ${"n" . ($i + 1)} * $j;
      }
      $d1 = 11 - ($d1 % 11);
      $d1 = $d1 >= 10 ? 0 : $d1;

      // Calcula o segundo dígito verificador
      $d2 = 0;
      for ($i = 0, $j = 11; $i < 9; $i++, $j--) {
          $d2 += ${"n" . ($i + 1)} * $j;
      }
      $d2 += $d1 * 2;
      $d2 = 11 - ($d2 % 11);
      $d2 = $d2 >= 10 ? 0 : $d2;

      return "{$n1}{$n2}{$n3}.{$n4}{$n5}{$n6}.{$n7}{$n8}{$n9}-{$d1}{$d2}";
  }

}
