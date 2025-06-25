import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { resetDatabase } from './db';

describe('PostsController (e2e)', () => {
  // app: テスト対象のNestJSアプリケーションを格納
  // createdPostId: POST /posts で作成された投稿のIDを後続のテストで使いまわすための変数
  let app: INestApplication;
  let createdPostId: number;

  /*
  テスト前に初期化
  resetDatabase()：テスト前にDBの状態をクリーンにします（前回の投稿データを消す）
  NestJSアプリケーションを立ち上げる処理：
  Test.createTestingModule(...) でモジュールを準備
  app.init() で実際にアプリを起動 
  */
  beforeAll(async () => {
    await resetDatabase();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  /* 
  テスト後にアプリを終了してポートを解放
  メモリリークやポート重複の防止に重要
  */
  afterAll(async () => {
    await app.close();
  });

  /*
  POST /posts: 投稿を作成
  正しく投稿を作成できるか確認
  戻ってきた id を createdPostId に保存し、後続テストで再利用
  */
  it('/posts (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .send({ title: 'E2E Test Title', content: 'E2E Test Content' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('E2E Test Title');
    createdPostId = response.body.id;
  });

  /* 
  GET /posts: 一覧取得
  一覧取得ができるかを確認
  配列で返ってくるか、少なくとも1件はあるかを検証
  */
  it('/posts (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/posts')
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  /*
  GET /posts/:id: 単一取得
  先ほど作った投稿が取得できるか
  ID・タイトルが一致しているかチェック
  */
  it('GET /posts/:id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/posts/${createdPostId}`)
      .expect(200);

    expect(response.body.id).toBe(createdPostId);
    expect(response.body.title).toBe('E2E Test Title');
  });

  /* 
  PATCH /posts/:id: 更新
  タイトル・本文の両方が更新できているかを確認
  */
  it('PATCH /posts/:id', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/posts/${createdPostId}`)
      .send({ title: 'Updated Title', content: 'Updated Content' })
      .expect(200);

    expect(response.body.title).toBe('Updated Title');
    expect(response.body.content).toBe('Updated Content');
  });

  /* 
  DELETE /posts/:id: 削除 → 再取得で404
  削除が成功したか
  その後に GET /posts/:id して 404 Not Found が返ることで、確実に削除されていることを検証
  */
  it('DELETE /posts/:id', async () => {
    await request(app.getHttpServer())
      .delete(`/posts/${createdPostId}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/posts/${createdPostId}`)
      .expect(404);
  });
});
