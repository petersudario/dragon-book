<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contact;
use App\Models\User;

class ContactsSeeder extends Seeder
{
    /**
     * Executa o seeder.
     *
     * @return void
     */
    public function run()
    {
        $users = User::all();

        if ($users->isEmpty()) {
            $users = User::factory()->count(10)->create();
        }

        $userCpfs = [];

        $users->each(function ($user) use (&$userCpfs) {
            // Define quantos contatos criar para cada usuário
            $numberOfContacts = rand(5, 15);

            for ($i = 0; $i < $numberOfContacts; $i++) {
                // Gera um CPF único para o usuário
                do {
                    $cpf = $this->generateValidCpf();
                } while (in_array($cpf, $userCpfs[$user->id] ?? []));

                // Registra o CPF como usado para o usuário
                $userCpfs[$user->id][] = $cpf;

                // Cria o contato
                Contact::factory()->create([
                    'user_id' => $user->id,
                    'cpf' => $cpf,
                ]);
            }
        });
    }

    /**
     * Gera um CPF válido.
     *
     * @return string
     */
    private function generateValidCpf()
    {
        $cpf = '';

        // Gera os primeiros 9 dígitos
        for ($i = 0; $i < 9; $i++) {
            $cpf .= mt_rand(0, 9);
        }

        // Calcula o primeiro dígito verificador
        $sum = 0;
        for ($i = 0, $weight = 10; $i < 9; $i++, $weight--) {
            $sum += $cpf[$i] * $weight;
        }
        $remainder = $sum % 11;
        $digit1 = ($remainder < 2) ? 0 : 11 - $remainder;
        $cpf .= $digit1;

        // Calcula o segundo dígito verificador
        $sum = 0;
        for ($i = 0, $weight = 11; $i < 10; $i++, $weight--) {
            $sum += $cpf[$i] * $weight;
        }
        $remainder = $sum % 11;
        $digit2 = ($remainder < 2) ? 0 : 11 - $remainder;
        $cpf .= $digit2;

        // Evita CPFs com todos os dígitos iguais
        if (preg_match('/(\d)\1{10}/', $cpf)) {
            return $this->generateValidCpf();
        }

        return $cpf;
    }
}
