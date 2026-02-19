import React, { useEffect, useState } from 'react';
import api from '../services/api';
// ADICIONADO 'Code' E OUTROS ÍCONES NECESSÁRIOS NO IMPORT ABAIXO
import { Trash2, Download, Box, CheckCircle, RefreshCw, Eye, X, Plus, Edit, Code } from 'lucide-react';
import Swal from 'sweetalert2';

const EntidadesList: React.FC = () => {
    const [entidades, setEntidades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // ESTADOS PARA O PREVIEW DINÂMICO (SISTEMA REAL DENTRO DA MODAL)
    const [showModal, setShowModal] = useState(false);
    const [entidadeAtiva, setEntidadeAtiva] = useState<any>(null);
    const [mockData, setMockData] = useState<any[]>([]);
    const [formData, setFormData] = useState<any>({});
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    useEffect(() => {
        carregarEntidades();
    }, []);

    const carregarEntidades = async () => {
        setLoading(true);
        try {
            const response = await api.get('/Scaffolding/stats');
            setEntidades(response.data.lista || []);
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível carregar o ecossistema.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // ALTERADO: Agora esta função baixa o PROJETO COMPLETO (.ZIP) via API
    const handleDownloadFullProject = async (entidade: any) => {
        try {
            Swal.fire({ 
                title: 'Preparando Pacote...', 
                text: 'Construindo Model, Controller e View para Visual Studio',
                allowOutsideClick: false, 
                didOpen: () => Swal.showLoading() 
            });

            const response = await api.post('/Scaffolding/download-full-project', {
                entityName: entidade.entityName,
                fields: entidade.fields
            }, {
                responseType: 'blob' // ESSENCIAL para receber o arquivo ZIP
            });

            // Lógica para disparar o download do arquivo binário
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Projeto_${entidade.entityName}_DevBoost.zip`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            Swal.close();
            Swal.fire({ title: 'Download Iniciado!', icon: 'success', timer: 1500, toast: true, position: 'top-end', showConfirmButton: false });
        } catch (error) {
            Swal.close();
            Swal.fire('Erro', 'Falha ao gerar o pacote completo no servidor.', 'error');
        }
    };

    // --- LÓGICA DE PREVIEW REAL (CADASTRO, EDIÇÃO, EXCLUSÃO) ---
    const abrirPreview = (entidade: any) => {
        setEntidadeAtiva(entidade);
        setMockData([]); 
        setFormData({});
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSavePreview = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && editId !== null) {
            // Lógica de Atualizar
            setMockData(mockData.map(item => item.id === editId ? { ...formData, id: editId } : item));
            setIsEditing(false);
            setEditId(null);
            Swal.fire({ title: 'Registro Atualizado!', icon: 'success', timer: 800, toast: true, position: 'top-end', showConfirmButton: false });
        } else {
            // Lógica de Inserir
            const newItem = { ...formData, id: mockData.length + 1 };
            setMockData([...mockData, newItem]);
            Swal.fire({ title: 'Cadastrado com Sucesso!', icon: 'success', timer: 800, toast: true, position: 'top-end', showConfirmButton: false });
        }
        setFormData({});
    };

    const iniciarEdicaoPreview = (item: any) => {
        setFormData(item);
        setIsEditing(true);
        setEditId(item.id);
    };

    const handleExcluirEntidade = async (nome: string) => {
        const result = await Swal.fire({
            title: 'Remover do Ecossistema?',
            text: `A entidade "${nome}" será excluída permanentemente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sim, remover!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/Scaffolding/delete-entity/${nome}`);
                Swal.fire('Removido!', '', 'success');
                carregarEntidades();
            } catch (error) {
                Swal.fire('Erro', 'Falha na exclusão.', 'error');
            }
        }
    };

    return (
        <div className="container-fluid animate__animated animate__fadeIn p-4">
            <div className="card-glass p-4 border-gold">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="text-gold d-flex align-items-center m-0">
                        <Box className="me-3" size={32} /> Ecossistema DevBoost
                    </h3>
                    <button className="btn btn-outline-gold btn-sm" onClick={carregarEntidades}>
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Atualizar
                    </button>
                </div>
                
                <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle">
                        <thead>
                            <tr className="border-gold-bottom text-gold">
                                <th>ENTIDADE</th>
                                <th>CAMPOS MAPEADOS</th>
                                <th className="text-center">AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entidades.length > 0 ? entidades.map((ent, index) => (
                                <tr key={index} className="border-secondary-bottom">
                                    <td className="fw-bold text-white fs-5">{ent.entityName}</td>
                                    <td>
                                        <div className="d-flex flex-wrap gap-1">
                                            {ent.fields.map((f: any, i: number) => (
                                                <span key={i} className="badge bg-dark border-gold-subtle small">{f.name} ({f.type})</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className="btn-group gap-2">
                                            <button className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1" onClick={() => abrirPreview(ent)}>
                                                <Eye size={16} /> Visualizar Tela
                                            </button>
                                            
                                            {/* BOTAO ATUALIZADO: Agora chama handleDownloadFullProject */}
                                            <button 
                                                className="btn btn-outline-info btn-sm d-flex align-items-center gap-1" 
                                                title="Baixar Projeto Visual Studio (.zip)" 
                                                onClick={() => handleDownloadFullProject(ent)}
                                            >
                                                <Download size={16} /> Projeto Full (.zip)
                                            </button>

                                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleExcluirEntidade(ent.entityName)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={3} className="text-center p-5 text-white-50">Nenhuma entidade no banco de dados.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DE PREVIEW FUNCIONAL (CADASTRO/EDIÇÃO/EXCLUSÃO) */}
            {showModal && entidadeAtiva && (
                <div className="modal-preview-overlay">
                    <div className="modal-preview-content card-glass border-gold p-4 animate__animated animate__zoomIn">
                        <div className="d-flex justify-content-between align-items-center mb-4 border-gold-bottom pb-2">
                            <h4 className="text-gold m-0"><Code size={22} className="me-2"/> Sistema de Gestão: {entidadeAtiva.entityName}</h4>
                            <X className="text-white cursor-pointer" onClick={() => setShowModal(false)} />
                        </div>

                        {/* FORMULÁRIO DE CADASTRO REAL */}
                        <form onSubmit={handleSavePreview} className="row g-3 mb-4 p-4 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(197, 164, 103, 0.2)' }}>
                            {entidadeAtiva.fields.filter((f: any) => f.name !== 'Id').map((f: any, i: number) => (
                                <div className="col-md-6" key={i}>
                                    <label className="text-white-50 small fw-bold">{f.name.toUpperCase()}</label>
                                    <input 
                                        type="text" 
                                        className="form-control custom-input" 
                                        placeholder={`Informe ${f.name}...`}
                                        value={formData[f.name] || ''} 
                                        onChange={(e) => setFormData({...formData, [f.name]: e.target.value})} 
                                        required 
                                    />
                                </div>
                            ))}
                            <div className="col-12 mt-4">
                                <button type="submit" className="btn btn-gold-action w-100">
                                    {isEditing ? 'SALVAR ALTERAÇÕES' : <><Plus size={18} className="me-2"/> CADASTRAR {entidadeAtiva.entityName.toUpperCase()}</>}
                                </button>
                            </div>
                        </form>

                        {/* LISTAGEM DOS DADOS CADASTRADOS NO TESTE */}
                        <div className="table-responsive" style={{maxHeight: '350px'}}>
                            <table className="table table-dark table-hover m-0">
                                <thead className="sticky-top bg-dark">
                                    <tr className="text-gold">
                                        {entidadeAtiva.fields.map((f: any, i: number) => <th key={i}>{f.name.toUpperCase()}</th>)}
                                        <th className="text-center">AÇÕES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockData.map((item, idx) => (
                                        <tr key={idx}>
                                            {entidadeAtiva.fields.map((f: any, i: number) => <td key={i}>{item[f.name]}</td>)}
                                            <td className="text-center">
                                                <button className="btn btn-sm btn-outline-warning me-2" onClick={() => iniciarEdicaoPreview(item)}><Edit size={14}/></button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => setMockData(mockData.filter(d => d.id !== item.id))}><Trash2 size={14}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {mockData.length === 0 && (
                                        <tr>
                                            <td colSpan={entidadeAtiva.fields.length + 1} className="text-center p-4 text-white-50">
                                                Nenhum registro criado no ambiente de teste.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-end">
                            <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>SAIR DO PREVIEW</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .modal-preview-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.92); display: flex; align-items: center; justify-content: center; z-index: 10000;
                    padding: 20px;
                }
                .modal-preview-content { width: 95%; max-width: 1100px; max-height: 90vh; overflow-y: auto; box-shadow: 0 0 40px rgba(197, 164, 103, 0.2); }
                .btn-gold-action { background: #c5a467; color: #000; font-weight: bold; border: none; padding: 12px; transition: 0.3s; }
                .btn-gold-action:hover { background: #fff; transform: scale(1.01); }
                .cursor-pointer { cursor: pointer; }
                .custom-input { background: rgba(255,255,255,0.05) !important; border: 1px solid rgba(197, 164, 103, 0.4) !important; color: white !important; }
                .custom-input:focus { border-color: #c5a467 !important; box-shadow: 0 0 10px rgba(197, 164, 103, 0.2); }
            `}</style>
        </div>
    );
};

export default EntidadesList;