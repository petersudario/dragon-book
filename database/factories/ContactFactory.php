<?php

namespace Database\Factories;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactFactory extends Factory
{
    protected $model = Contact::class;


    /**
     * Define os atributos padrão para o modelo Contact.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(), // Cria um usuário se não houver um
            'nome' => $this->faker->name(),
            'cpf' => $this->generateValidCpf(),
            'telefone' => $this->faker->phoneNumber(),
            'endereco' => $this->faker->streetAddress(),
            'cep' => $this->faker->postcode(),
            'latitude' => $this->faker->latitude(-34.0, -5.0), // Latitude no Brasil
            'longitude' => $this->faker->longitude(-74.0, -34.0), // Longitude no Brasil
            'complemento' => $this->faker->optional()->secondaryAddress(),
        ];
    }

    /**
     * Gera um CPF válido.
     *
     * @return string
     */
    private function generateValidCpf()
    {
        $cpf = $this->faker->numerify('###########');

        // Remove caracteres não numéricos
        $cpf = preg_replace('/[^0-9]/', '', $cpf);

        // Verifica se o CPF tem 11 dígitos
        if (strlen($cpf) !== 11) {
            return $this->generateValidCpf();
        }

        // Evita CPFs com todos os dígitos iguais
        if (preg_match('/(\d)\1{10}/', $cpf)) {
            return $this->generateValidCpf();
        }

        // Calcula os dígitos verificadores
        for ($t = 9; $t < 11; $t++) {
            $sum = 0;
            for ($c = 0; $c < $t; $c++) {
                $sum += $cpf[$c] * (($t + 1) - $c);
            }
            $d = ((10 * $sum) % 11) % 10;
            if ($cpf[$c] != $d) {
                return $this->generateValidCpf();
            }
        }

        return $cpf;
    }
}
