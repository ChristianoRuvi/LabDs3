use diesel::prelude::*;
use crate::models::{Usuario, NovoUsuario};
use crate::schema::usuarios;

pub struct UsuarioRepository<'a> {
    conn: &'a PgConnection,
}

impl<'a> UsuarioRepository<'a> {
    pub fn new(conn: &'a PgConnection) -> Self {
        UsuarioRepository { conn }
    }

    pub fn find_by_id(&self, id: i32) -> QueryResult<Usuario> {
        usuarios::table.find(id).get_result(self.conn)
    }

    pub fn find_by_email(&self, email: &str) -> QueryResult<Usuario> {
        usuarios::table.filter(usuarios::email.eq(email)).first(self.conn)
    }

    pub fn find_all(&self) -> QueryResult<Vec<Usuario>> {
        usuarios::table.load::<Usuario>(self.conn)
    }

    pub fn create(&self, novo_usuario: &NovoUsuario) -> QueryResult<Usuario> {
        diesel::insert_into(usuarios::table)
            .values(novo_usuario)
            .get_result(self.conn)
    }

    pub fn update(&self, usuario: &Usuario) -> QueryResult<Usuario> {
        diesel::update(usuarios::table.find(usuario.id))
            .set(usuario)
            .get_result(self.conn)
    }

    pub fn delete(&self, id: i32) -> QueryResult<usize> {
        diesel::delete(usuarios::table.find(id))
            .execute(self.conn)
    }

    pub fn atualizar_ultimo_acesso(&self, id: i32) -> QueryResult<Usuario> {
        diesel::update(usuarios::table.find(id))
            .set(usuarios::ultimo_acesso.eq(diesel::dsl::now))
            .get_result(self.conn)
    }
}



use diesel::prelude::*;
use crate::models::{Transacao, NovaTransacao};
use crate::schema::transacoes;

pub struct TransacaoRepository<'a> {
    conn: &'a PgConnection,
}

impl<'a> TransacaoRepository<'a> {
    pub fn new(conn: &'a PgConnection) -> Self {
        TransacaoRepository { conn }
    }

    pub fn find_by_id(&self, id: i32) -> QueryResult<Transacao> {
        transacoes::table.find(id).get_result(self.conn)
    }

    pub fn find_by_usuario(&self, usuario_id: i32) -> QueryResult<Vec<Transacao>> {
        transacoes::table
            .filter(transacoes::remetente_id.eq(usuario_id).or(transacoes::destinatario_id.eq(usuario_id)))
            .order(transacoes::data.desc())
            .load::<Transacao>(self.conn)
    }

    pub fn create(&self, nova_transacao: &NovaTransacao) -> QueryResult<Transacao> {
        diesel::insert_into(transacoes::table)
            .values(nova_transacao)
            .get_result(self.conn)
    }

    pub fn get_saldo_usuario(&self, usuario_id: i32) -> QueryResult<i32> {
        let recebidas: i32 = transacoes::table
            .filter(transacoes::destinatario_id.eq(usuario_id))
            .select(diesel::dsl::sum(transacoes::quantidade_moedas))
            .first(self.conn)?;

        let enviadas: i32 = transacoes::table
            .filter(transacoes::remetente_id.eq(usuario_id))
            .select(diesel::dsl::sum(transacoes::quantidade_moedas))
            .first(self.conn)?;

        Ok(recebidas - enviadas)
    }
}