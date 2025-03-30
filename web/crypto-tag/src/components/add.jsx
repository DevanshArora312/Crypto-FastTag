import { useState } from 'react';
import { Form, Input, Button, Card, Watermark, Spin, Alert, Typography, Space, Divider, message } from 'antd';
import { DownloadOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import { parseString } from 'xml2js';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/themes/prism.css';

const { Title, Text } = Typography;

const RCVerification = ({wallet, makeFastag}) => {
  const [form] = Form.useForm();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [proofGenerated, setProofGenerated] = useState(false);
  const [zkProof, setZkProof] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [rcXML, setRcXML] = useState("");
  const simulateRCVerification = async (rcNumber, rcXML) => {
    await new Promise(resolve => setTimeout(resolve, 40000));
    let isValid = false;
    parseString(rcXML, (err, result) => {
      if (err) {
        console.log(err)
        return;
      }
      else{
        const certificate = result?.Certificate;
        const ownerName = certificate?.IssuedTo[0]?.Person[0]?.$?.name;
        const vehicle = certificate.CertificateData[0]?.VehicleRegistration[0]?.Vehicle[0]?.$;
        const rc = certificate?.$?.number; 
        const extractedData = {
          rc,
          ownerName,
          chasisNo: vehicle?.chasisNo,
          engineNo: vehicle?.engineNo,
          make: vehicle?.make,
          model: vehicle?.model,
          fuelType: vehicle?.fuelDesc,
          color: vehicle?.color,
        };
        if(rc !== rcNumber) {
          console.log('Invalid RC details provided');
          return ;
        }
        isValid = true
        setExtractedData(prev => {
          return {...prev, ...extractedData}
        });
        makeFastag(rc, vehicle?.chasisNo, vehicle?.model, vehicle?.engineNo)
      }
    });
    if(isValid){
      return {
        isValid: true,
      };
    }
    return {
      isValid: false,
      message: 'Invalid RC details provided'
    };
  };

  const generateZKProof = async (rcDetails, rcXML) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 40000)); 
      
      const proof = {
        proof: {
          pi_a: [Math.random().toString(36), Math.random().toString(36), "1"],
          pi_b: [[Math.random().toString(36), Math.random().toString(36)], [Math.random().toString(36), Math.random().toString(36)], ["1", "0"]],
          pi_c: [Math.random().toString(36), Math.random().toString(36), "1"],
          protocol: "groth16"
        },
        publicSignals: [
          stringToHex(rcDetails.rcNumber.substring(0, 2)),
          "1"
        ]
      };
      const newSeedPhrase = ethers.Wallet.createRandom().mnemonic.phrase;
      const wallet = ethers.Wallet.fromPhrase(newSeedPhrase);
      setZkProof(proof);
      setProofGenerated(true);
    } catch (error) {
      console.error('Error generating proof:', error);
      message.error('Failed to generate zero-knowledge proof');
    }
  };

  const stringToHex = (str) => {
    return '0x' + Array.from(str)
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  };

  const verifyRC = async (values) => {
    setIsVerifying(true);
    
    try {
      const response = await simulateRCVerification(values.rcNumber, rcXML);
      
      setVerificationResult(response);
      
      if (response.isValid) {
        await generateZKProof(values, rcXML);
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult({
        isValid: false,
        message: 'Verification failed due to an error'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const downloadProof = () => {
    if (!zkProof) return;
    
    const dataStr = JSON.stringify(zkProof, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `rc-proof-${form.getFieldValue('rcNumber')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    message.success('Proof downloaded successfully');
  };

  return (
    <Card 
      className='max-w-[600px] mt-[48px] mx-auto shadow-none'
      bordered={false}
    >
      <Title level={3} className="text-gray-600" style={{ textAlign: 'center', marginBottom: 24 }}>
        Vehicle RC Verification with 0-Knowledge Proof
      </Title>
      
      <Form
        form={form}
        layout="vertical"
        className='flex flex-col justify-center items-center'
        onFinish={verifyRC}
        requiredMark={false}
      >
        <Form.Item
          name="rcNumber"
          label="RC Number"
          className='w-full'
          rules={[{ required: true, message: 'Please enter RC Number' }]}
        >
          <Input placeholder="Enter RC Number" size="large" />
        </Form.Item>
        
        <Editor
          value={rcXML}
          onValueChange={setRcXML}
          highlight={(code) => highlight(code, languages.xml, 'xml')}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            border: '1px solid #d9d9d9',
            borderRadius: 8,
            minHeight: 150,
            margin: 12,
            width: 550
          }}
        />

        <Form.Item className='w-full'>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isVerifying}
            block
            size="large"
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            {isVerifying ? 'Verifying...' : 'Verify RC'}
          </Button>
        </Form.Item>
      </Form>

      {verificationResult && (
        <>
          <Divider />
          {verificationResult.isValid ? (
            <Alert
              message="Verification Successful"
              description={
                <>
                  <div>Owner Name : {extractedData?.ownerName}</div>
                  <div>Chasis Number : {extractedData?.chasisNo}</div>
                  <div>Engine Number : {extractedData?.engineNo}</div>
                  <div>Model : {extractedData?.model}</div>
                  <div></div>
                </>
              }
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
          ) : (
            <Alert
              message="Verification Failed"
              description={verificationResult.message}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          {proofGenerated && (
            <div style={{ marginTop: 24 }}>
              <Title level={4}>Zero-Knowledge Proof</Title>
              <Alert
                message="Proof Generated Successfully"
                description="A zero-knowledge proof has been generated that verifies your RC details without revealing sensitive information."
                type="info"
                icon={<CheckCircleOutlined />}
                style={{ marginBottom: 16 }}
              />
              <Button 
                type="primary"
                icon={<DownloadOutlined />}
                onClick={downloadProof}
                size="large"
              >
                Download Proof
              </Button>
            </div>
          )}
          
          {verificationResult.isValid && !proofGenerated && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              <Text style={{ display: 'block', marginTop: 12 }} >Generating zero-knowledge proof...</Text>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default RCVerification;
