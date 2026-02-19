import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Eye, Code, Database, Play, LogOut, TrendingUp, Zap, Layers, Plus, Edit, Trash2, Box, Palette } from 'lucide-react'; 
import api from '../services/api';
import Swal from 'sweetalert2';

interface FieldDefinition {
    name: string;
    type: string;
}

const GeneratorEngine: React.FC = () => {
    // Estados Principais
    const [entityName, setEntityName] = useState('');
    const [fields, setFields] = useState<FieldDefinition[]>([{ name: 'Id', type: 'int' }]);
    const [newFieldName, setNewFieldName] = useState('');
    const [newFieldType, setNewFieldType] = useState('string');

    // Estados de Código, Temas e Preview
    const [generatedCode, setGeneratedCode] = useState({ model: '', repository: '' });
    const [activeTab, setActiveTab] = useState('model');
    const [selectedTheme, setSelectedTheme] = useState('gold'); // gold, cyber, emerald
    
    // Estados do CRUD no Preview
    const [mockData, setMockData] = useState<any[]>([]);
    const [currentFormData, setCurrentFormData] = useState<any>({});
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    // ESTADO PARA O CONTADOR REAL DO ECOSSISTEMA
    const [totalSaved, setTotalSaved] = useState(0);

    // Definição dos Temas CSS
    const themes: any = {
        gold: { color: '#c5a467', name: 'Ouro Premium', bg: 'rgba(197, 164, 103, 0.1)' },
        cyber: { color: '#00d4ff', name: 'Cyber Blue', bg: 'rgba(0, 212, 255, 0.1)' },
        emerald: { color: '#00ff88', name: 'Emerald Dark', bg: 'rgba(0, 255, 136, 0.1)' }
    };

    // CARREGAR ESTATÍSTICAS AO INICIAR
    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await api.get('/Scaffolding/stats');
            setTotalSaved(response.data.totalEntidades);
        } catch (error) {
            console.error("Erro ao carregar métricas do ecossistema");
        }
    };

    const addField = () => {
        if (!newFieldName) return;
        setFields([...fields, { name: newFieldName, type: newFieldType }]);
        setNewFieldName('');
    };

    const removeField = (index: number) => {
        if (fields[index].name === 'Id') return;
        setFields(fields.filter((_, i) => i !== index));
    };

    const handleGenerate = async () => {
        if (!entityName) return Swal.fire('Atenção', 'Nome da Entidade é obrigatório', 'warning');
        try {
            const response = await api.post('/Scaffolding/generate', { entityName, fields });
            setGeneratedCode({ model: response.data.csharpCode, repository: response.data.repositoryCode });
            setMockData([]);
            Swal.fire('Show!', 'Motor DevBoost acionado!', 'success');
        } catch (error) {
            Swal.fire('Erro', 'Falha na comunicação com a API', 'error');
        }
    };

    // SALVAR ENTIDADE PERMANENTEMENTE NO ARQUIVO JSON DA API
    const handleSavePermanent = async () => {
        if (!entityName) return Swal.fire('Atenção', 'Gere a entidade antes de salvar', 'warning');
        
        try {
            const response = await api.post('/Scaffolding/save-schema', {
                entityName: entityName,
                fields: fields
            });
            
            Swal.fire('Registrado!', response.data.message, 'success');
            loadStats(); // Atualiza o contador na hora
        } catch (error: any) {
            Swal.fire('Erro', error.response?.data?.error || 'Erro ao salvar no ecossistema', 'error');
        }
    };

    // Lógica do CRUD Real no Preview
    const handleSaveMock = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && editId !== null) {
            setMockData(mockData.map(item => item.id === editId ? { ...currentFormData, id: editId } : item));
            setIsEditing(false);
            setEditId(null);
        } else {
            const newItem = { ...currentFormData, id: mockData.length + 1 };
            setMockData([...mockData, newItem]);
        }
        setCurrentFormData({});
        Swal.fire({ title: isEditing ? 'Editado!' : 'Salvo!', icon: 'success', timer: 800, toast: true, position: 'top-end', showConfirmButton: false });
    };

    const startEdit = (item: any) => {
        setCurrentFormData(item);
        setIsEditing(true);
        setEditId(item.id);
        window.scrollTo({ top: 500, behavior: 'smooth' });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        Swal.fire({ title: 'Copiado!', icon: 'success', timer: 1000, toast: true, position: 'top-end', showConfirmButton: false });
    };

    return (
        <div className="generator-container animate__animated animate__fadeIn">
            
            {/* SEÇÃO DE MÉTRICAS */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card-glass p-3 d-flex align-items-center">
                        <TrendingUp color={themes[selectedTheme].color} size={24} className="me-3" />
                        <div>
                            <p className="text-white-50 small mb-0">ENTIDADES SALVAS</p>
                            <h4 className="text-white fw-black mb-0">{totalSaved}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card-glass p-3 d-flex align-items-center">
                        <Palette color={themes[selectedTheme].color} size={24} className="me-3" />
                        <div><p className="text-white-50 small mb-0">TEMA ATIVO</p><h4 className="fw-black mb-0" style={{color: themes[selectedTheme].color}}>{themes[selectedTheme].name}</h4></div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card-glass p-3 d-flex align-items-center">
                        <Layers color={themes[selectedTheme].color} size={24} className="me-3" />
                        <div><p className="text-white-50 small mb-0">ECONOMIA</p><h4 className="text-white fw-black mb-0">~12.4k</h4></div>
                    </div>
                </div>
            </div>

            {/* CONFIGURAÇÃO DA ENTIDADE */}
            <div className="card-glass p-4 mb-4">
                <h5 style={{color: themes[selectedTheme].color}} className="mb-4"><Box size={20} className="me-2"/> Arquiteto de Entidade</h5>
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="text-white-50 small fw-bold">NOME DA ENTIDADE</label>
                        <input type="text" className="form-control custom-input" value={entityName} onChange={(e) => setEntityName(e.target.value)} placeholder="Ex: Cliente" />
                    </div>
                    <div className="col-md-3">
                        <label className="text-white-50 small fw-bold">NOVO CAMPO</label>
                        <input type="text" className="form-control custom-input" value={newFieldName} onChange={(e) => setNewFieldName(e.target.value)} placeholder="Ex: Cpf" />
                    </div>
                    <div className="col-md-2">
                        <label className="text-white-50 small fw-bold">TIPO</label>
                        <select className="form-select custom-input" value={newFieldType} onChange={(e) => setNewFieldType(e.target.value)}>
                            <option value="string">string</option><option value="int">int</option><option value="decimal">decimal</option><option value="DateTime">DateTime</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label className="text-white-50 small fw-bold">TEMA DA TELA</label>
                        <select className="form-select custom-input" value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
                            <option value="gold">Ouro</option><option value="cyber">Cyber</option><option value="emerald">Emerald</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-outline-gold w-100 mt-4" style={{borderColor: themes[selectedTheme].color, color: themes[selectedTheme].color}} onClick={addField}><Plus size={18} /></button>
                    </div>
                </div>

                <div className="mt-3 d-flex flex-wrap gap-2">
                    {fields.map((f, index) => (
                        <span key={index} className="badge bg-dark p-2" style={{border: `1px solid ${themes[selectedTheme].color}`}}>
                            {f.name} ({f.type}) {f.name !== 'Id' && <Trash2 size={12} className="ms-2 text-danger cursor-pointer" onClick={() => removeField(index)} />}
                        </span>
                    ))}
                </div>

                <div className="row mt-4">
                    <div className="col-md-6">
                        <button className="btn-premium w-100" style={{background: `linear-gradient(45deg, ${themes[selectedTheme].color}, #000)`}} onClick={handleGenerate}>
                            <Play size={18} className="me-2" /> GERAR SISTEMA COMPLETO
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn btn-outline-success w-100 h-100 fw-bold" style={{ borderColor: '#28a745', borderStyle: 'dashed' }} onClick={handleSavePermanent}>
                            <Database size={18} className="me-2" /> SALVAR NO ECOSSISTEMA
                        </button>
                    </div>
                </div>
            </div>

            {generatedCode.model && (
                <div className="code-display-section card-glass" style={{borderColor: themes[selectedTheme].color}}>
                    <div className="tabs-header">
                        <button className={activeTab === 'model' ? 'active' : ''} onClick={() => setActiveTab('model')}><Code size={16} /> Model</button>
                        <button className={activeTab === 'repo' ? 'active' : ''} onClick={() => setActiveTab('repo')}><Database size={16} /> Repository</button>
                        <button className={activeTab === 'preview' ? 'active' : ''} onClick={() => setActiveTab('preview')}><Eye size={16} /> Preview Real</button>
                        <button className={activeTab === 'theme' ? 'active' : ''} onClick={() => setActiveTab('theme')}><Palette size={16} /> CSS Theme</button>
                    </div>

                    <div className="tab-content p-3">
                        {activeTab === 'theme' ? (
                            <div className="p-2">
                                <button className="btn btn-sm btn-outline-info mb-2" onClick={() => copyToClipboard(`.theme-custom { color: ${themes[selectedTheme].color}; border: 1px solid ${themes[selectedTheme].color}; }`)}>Copiar CSS</button>
                                <SyntaxHighlighter language="css" style={vscDarkPlus}>
                                    {`.devboost-theme { \n  --primary-color: ${themes[selectedTheme].color};\n  --bg-accent: ${themes[selectedTheme].bg};\n  font-family: 'Segoe UI', sans-serif;\n}`}
                                </SyntaxHighlighter>
                            </div>
                        ) : activeTab !== 'preview' ? (
                            <SyntaxHighlighter language="csharp" style={vscDarkPlus} customStyle={{background: 'transparent'}}>
                                {activeTab === 'model' ? generatedCode.model : generatedCode.repository}
                            </SyntaxHighlighter>
                        ) : (
                            <div className="preview-mode p-3 animate__animated animate__fadeIn">
                                <h4 style={{color: themes[selectedTheme].color}} className="mb-4 text-center">GESTÃO DE {entityName.toUpperCase()}</h4>
                                
                                <form onSubmit={handleSaveMock} className="row g-3 mb-4 p-4 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${themes[selectedTheme].color}` }}>
                                    {fields.filter(f => f.name !== 'Id').map((f, index) => (
                                        <div className="col-md-6" key={index}>
                                            <label className="text-white-50 small fw-bold">{f.name.toUpperCase()}</label>
                                            <input type="text" className="form-control custom-input" placeholder={f.name} value={currentFormData[f.name] || ''} onChange={(e) => setCurrentFormData({...currentFormData, [f.name]: e.target.value})} required />
                                        </div>
                                    ))}
                                    <div className="col-12 mt-4">
                                        <button type="submit" className="btn w-100 fw-bold" style={{backgroundColor: themes[selectedTheme].color, color: '#000'}}>
                                            {isEditing ? 'ATUALIZAR REGISTRO' : `CADASTRAR EM ${entityName.toUpperCase()}`}
                                        </button>
                                    </div>
                                </form>

                                <div className="table-responsive">
                                    <table className="table table-dark table-hover m-0">
                                        <thead>
                                            <tr style={{borderBottom: `2px solid ${themes[selectedTheme].color}`}}>
                                                {fields.map((f, i) => <th key={i} className="p-3" style={{color: themes[selectedTheme].color}}>{f.name.toUpperCase()}</th>)}
                                                <th className="text-center">AÇÕES</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mockData.map((item, idx) => (
                                                <tr key={idx}>
                                                    {fields.map((f, i) => <td key={i} className="p-3">{item[f.name]}</td>)}
                                                    <td className="text-center">
                                                        <button className="btn btn-sm btn-outline-warning me-2" onClick={() => startEdit(item)}><Edit size={12}/></button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => setMockData(mockData.filter(d => d.id !== item.id))}><Trash2 size={12}/></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeneratorEngine;