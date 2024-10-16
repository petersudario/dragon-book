<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    // Campos que podem ser mass-assigned
    protected $fillable = [
        'user_id',
        'nome',
        'cpf',
        'telefone',
        'endereco',
        'cep',
        'latitude',
        'longitude',
        'complemento',
    ];

    /**
     * Relacionamento com o usuário.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
