import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Rocket, Cpu, ShieldCheck, Code2 } from 'lucide-react';
import api from '../services/api'; // Certifique-se de importar o axios configurado

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Tempo para o Skeleton brilhar
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2500));

    try {
        // Busca a lista de usuários da sua nova UsuariosController
        const response = await api.get('/Usuarios');
        const usuarios = response.data;

        // Procura o usuário que bate com o que você digitou
        const usuarioValido = usuarios.find((u: any) => 
            u.email === email && u.senha === senha
        );

        // Aguarda o tempo do Skeleton para uma transição suave
        await minLoadingTime;

        if (usuarioValido) {
            localStorage.setItem('user_name', usuarioValido.nome);
            localStorage.setItem('auth', 'true');
            navigate('/dashboard');
        } else {
            setLoading(false);
            Swal.fire('Erro', 'Credenciais inválidas no banco de dados JSON', 'error');
        }
    } catch (error) {
        setLoading(false);
        console.error(error);
        Swal.fire('Erro de Conexão', 'Não foi possível conectar à API C#', 'error');
    }
};

    return (
        <div style={{ 
            height: '100vh', width: '100vw', display: 'flex', 
            alignItems: 'center', justifyContent: 'center',
            // Imagem temática: Código e Engenharia de Software
            backgroundImage: 'url("https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
            backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'
        }}>
            {/* Overlay Dark com transparência padrão */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1 }}></div>

            <div className="animate__animated animate__fadeIn" style={{ 
                width: '950px', minHeight: '580px', display: 'flex',
                borderRadius: '25px', overflow: 'hidden', zIndex: 2,
                boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
                backdropFilter: 'blur(15px)', backgroundColor: 'rgba(20, 20, 20, 0.6)',
                border: '1px solid rgba(197, 164, 103, 0.2)' // Borda Gold sutil do Showcase
            }}>
                
                {/* LADO ESQUERDO: FORMULÁRIO DE ACESSO */}
                <div style={{ flex: 1, padding: '60px', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    {loading ? (
                        <div className="skeleton-wrapper">
                            <div className="skeleton skeleton-title"></div>
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-input"></div>
                            <div className="skeleton skeleton-input"></div>
                            <div className="skeleton skeleton-button"></div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-5 text-center">
                                {/* Inserindo o Rocket para validar o import e sumir o erro amarelo */}
                                <Rocket 
                                    size={54} 
                                    style={{ color: '#c5a467' }} 
                                    className="mb-3 animate__animated animate__bounceIn" 
                                />
                                
                                <h2 className="fw-black text-white mb-0" style={{ letterSpacing: '3px' }}>
                                    DEV<span style={{ color: '#c5a467' }}>BOOST</span>
                                </h2>
                                <p className="text-white-50 small fw-bold mt-2">SCAFFOLDING ENGINE ACCESS</p>
                            </div>

                            <form onSubmit={handleLogin}>
                                <div className="mb-4">
                                    <label style={{ color: '#c5a467', fontSize: '12px', fontWeight: 'bold' }}>DEVELOPER EMAIL</label>
                                    <input type="email" className="form-control custom-input" placeholder="admin@devboost.com" onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className="mb-5">
                                    <label style={{ color: '#c5a467', fontSize: '12px', fontWeight: 'bold' }}>SECURITY KEY</label>
                                    <input type="password" className="form-control custom-input" placeholder="••••••••" onChange={e => setSenha(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn-premium w-100">
                                    ENTRAR NO SISTEMA 🚀
                                </button>
                            </form>
                        </>
                    )}
                </div>

                {/* LADO DIREITO: INSTRUÇÕES DO SISTEMA */}
                <div className="d-none d-md-flex" style={{ 
                    flex: 1.3, padding: '60px', 
                    background: 'linear-gradient(135deg, rgba(197,164,103,0.05), rgba(0,0,0,0.6))',
                    flexDirection: 'column', justifyContent: 'center'
                }}>
                    <h3 className="text-white fw-black mb-4">Aceleração de CRUD Full-Stack</h3>
                    
                    <div className="d-flex align-items-start mb-4">
                        <Code2 size={24} style={{ color: '#c5a467' }} className="me-3" />
                        <div>
                            <h6 className="text-white fw-bold mb-1">Geração de Modelos C#</h6>
                            <p className="text-white-50 small">Crie classes .NET 8 com tipagem forte e namespaces organizados automaticamente.</p>
                        </div>
                    </div>

                    <div className="d-flex align-items-start mb-4">
                        <Cpu size={24} style={{ color: '#c5a467' }} className="me-3" />
                        <div>
                            <h6 className="text-white fw-bold mb-1">Repositórios JSON</h6>
                            <p className="text-white-50 small">Implementação de persistência flat-file.</p>
                        </div>
                    </div>

                    <div className="d-flex align-items-start">
                        <ShieldCheck size={24} style={{ color: '#c5a467' }} className="me-3" />
                        <div>
                            <h6 className="text-white fw-bold mb-1">Arquitetura Escalável</h6>
                            <p className="text-white-50 small">Integração pronta para deploy via GitHub e Render.</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-input {
                    background-color: rgba(0, 0, 0, 0.4) !important;
                    border: 1px solid rgba(197, 164, 103, 0.2) !important;
                    color: white !important;
                    padding: 12px 15px !important;
                    border-radius: 8px !important;
                }
                .custom-input:focus {
                    border-color: #c5a467 !important;
                    box-shadow: 0 0 10px rgba(197, 164, 103, 0.2) !important;
                }
                .btn-premium {
                    background: linear-gradient(45deg, #c5a467, #8a6d3b);
                    color: white; font-weight: 900; border: none; padding: 15px;
                    border-radius: 12px; transition: 0.3s;
                }
                .btn-premium:hover { transform: scale(1.02); box-shadow: 0 10px 20px rgba(197, 164, 103, 0.3); }
                .fw-black { font-weight: 900; }

                /* SKELETON ANIMATION PADRÃO SMARTKIOSK */
                .skeleton {
                    background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
                    background-size: 200% 100%;
                    animation: loading-skeleton 1.5s infinite;
                    border-radius: 8px; margin-bottom: 20px;
                }
                @keyframes loading-skeleton {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .skeleton-title { height: 40px; width: 60%; margin: 0 auto 10px; }
                .skeleton-text { height: 15px; width: 40%; margin: 0 auto 40px; }
                .skeleton-input { height: 50px; width: 100%; }
                .skeleton-button { height: 55px; width: 100%; margin-top: 20px; border-radius: 12px; }
            `}</style>
        </div>
    );
};

export default LoginPage;