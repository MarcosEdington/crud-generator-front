import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
// ADICIONADO 'Box' NO IMPORT ABAIXO PARA CORRIGIR O ERRO DE "NOT DEFINED"
import { LayoutDashboard, Rocket, Code2, LogOut, User, Box } from 'lucide-react';
import '../styles/dashboard.scss';
import GeneratorEngine from '../components/GeneratorEngine';
import EntidadesList from './EntidadesList'; 


const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    
    // Controla a aba ativa
    const [activeTab, setActiveTab] = useState('generator');
    
    useEffect(() => {
        const isAuth = localStorage.getItem('auth');
        if (!isAuth) {
            navigate('/'); 
        }
    }, [navigate]);

    const userName = localStorage.getItem('user_name') || 'Desenvolvedor';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <Rocket color="#c5a467" size={32} />
                    <span>DEV<b style={{color: '#c5a467'}}>BOOST</b></span>
                </div>
                
                <nav className="sidebar-nav">
                    <div 
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <LayoutDashboard size={20} /> Dashboard
                    </div>

                    <div 
                        className={`nav-item ${activeTab === 'generator' ? 'active' : ''}`}
                        onClick={() => setActiveTab('generator')}
                    >
                        <Code2 size={20} /> Gerador de CRUD
                    </div>

                    {/* ITEM DE MENU CORRIGIDO */}
                    <div 
                        className={`nav-item ${activeTab === 'entidades' ? 'active' : ''}`}
                        onClick={() => setActiveTab('entidades')}
                    >
                        <Box size={20} /> Ecossistema Entidades
                    </div>
                </nav>

                <div className="sidebar-footer" onClick={handleLogout}>
                    <LogOut size={20} /> Sair do Sistema
                </div>
            </aside>

            <main className="main-content">
                <header className="top-header">
                    <div className="page-title">
                        {activeTab === 'generator' ? 'Gerador de Scaffolding' : 
                         activeTab === 'entidades' ? 'Ecossistema de Dados' : 'Visão Geral'}
                    </div>
                    <div className="user-profile">
                        <User size={18} className="me-2" />
                        <span>Olá, <b>{userName}</b></span>
                    </div>
                </header>

                <section className="content-body">
                    {/* LÓGICA DE RENDERIZAÇÃO DAS ABAS CORRIGIDA */}
                    {activeTab === 'generator' && <GeneratorEngine />}

                    {activeTab === 'entidades' && <EntidadesList />}

                    {activeTab === 'dashboard' && (
                        <div className="card-glass p-4 text-center">
                            <h2 className="text-gold">Estatísticas do Sistema</h2>
                            <p>Em breve: Métricas de geração e deploy.</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;